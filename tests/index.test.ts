import { describe, it, expect } from 'vitest'
import dedent from 'ts-dedent'

import dirtreeist from '../src/index'

import {
  multipleTop,
  oneTop,
  bold,
  ascii,
  emptyLineBeforeUpperHierarchy,
  spaceBeforeName,
  spaceSize10,
  fullOption,
} from './resource/output'

import { normalList } from './resource/markdown'

describe('multiple top', () => {
  it('success', () => {
    expect(dirtreeist(normalList)).toStrictEqual([multipleTop])
  })
})

describe('options', () => {
  it('treetype:1', () => {
    expect(dirtreeist(normalList, { treeType: 'normal' })).toStrictEqual([
      multipleTop,
    ])
  })

  it('treetype:2', () => {
    expect(dirtreeist(normalList, { treeType: 'bold' })).toStrictEqual([bold])
  })

  it('treetype:3', () => {
    expect(dirtreeist(normalList, { treeType: 'ascii' })).toStrictEqual([ascii])
  })

  it('emptyLineBeforeUpperHierarchy:true', () => {
    expect(
      dirtreeist(normalList, { emptyBeforeUpperHierarchy: true })
    ).toStrictEqual([emptyLineBeforeUpperHierarchy])
  })

  it('spaceBeforeName:true', () => {
    expect(dirtreeist(normalList, { spaceBeforeName: true })).toStrictEqual([
      spaceBeforeName,
    ])
  })

  it('spaceSize:10', () => {
    expect(dirtreeist(normalList, { spaceSize: 10 })).toStrictEqual([
      spaceSize10,
    ])
  })

  it('full option', () => {
    expect(
      dirtreeist(normalList, {
        treeType: 'bold',
        spaceSize: 4,
        spaceBeforeName: true,
        emptyBeforeUpperHierarchy: true,
      })
    ).toStrictEqual([fullOption])
  })

  it('keepMarkdown: true', () => {
    const md = dedent`
      - **bold**
        - *italic*
    `
    const expected = dedent`
      **bold**
      └─*italic*
    `
    expect(dirtreeist(md, { keepMarkdown: true })).toStrictEqual([expected])
  })

  it('keepMarkdown: link', () => {
    const md = '- [Google](https://google.com)'
    const expected = '[Google](https://google.com)'
    expect(dirtreeist(md, { keepMarkdown: true })).toStrictEqual([expected])
  })

  it('keepMarkdown: false (default)', () => {
    const md = '- **bold** item\n- [Google](https://google.com)'
    const expected = dedent`
      ├─bold item
      └─Google
    `
    expect(dirtreeist(md)).toStrictEqual([expected])
  })
})
