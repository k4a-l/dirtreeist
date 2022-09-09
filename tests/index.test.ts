import { describe, it, expect } from 'vitest'

import dirtreest from '../src/index'

// @ts-ignore
import {
  multipleTop,
  oneTop,
  bold,
  ascii,
  emptyLineBeforeUpperHierarchy,
  spaceBeforeName,
  spaceSize4,
  fullOption,
  // @ts-ignore
} from './resource/output'

import {
  normalList,
  // @ts-ignore
} from './resource/markdown'

describe('multiple top', () => {
  it('success', () => {
    expect(dirtreest(normalList)).toStrictEqual([multipleTop])
  })
})

describe('options', () => {
  it('treetype:1', () => {
    expect(dirtreest(normalList, { treeType: 'normal' })).toStrictEqual([
      multipleTop,
    ])
  })

  it('treetype:2', () => {
    expect(dirtreest(normalList, { treeType: 'bold' })).toStrictEqual([bold])
  })

  it('treetype:3', () => {
    expect(dirtreest(normalList, { treeType: 'ascii' })).toStrictEqual([ascii])
  })

  it('emptyLineBeforeUpperHierarchy:true', () => {
    expect(
      dirtreest(normalList, { emptyBeforeUpperHierarche: true })
    ).toStrictEqual([emptyLineBeforeUpperHierarchy])
  })

  it('spaceBeforeName:true', () => {
    expect(dirtreest(normalList, { spaceBeforeName: true })).toStrictEqual([
      spaceBeforeName,
    ])
  })

  it('spaceSize:4', () => {
    expect(dirtreest(normalList, { spaceSize: 4 })).toStrictEqual([spaceSize4])
  })

  it('full option', () => {
    expect(
      dirtreest(normalList, {
        treeType: 'bold',
        spaceSize: 4,
        spaceBeforeName: true,
        emptyBeforeUpperHierarche: true,
      })
    ).toStrictEqual([fullOption])
  })
})
