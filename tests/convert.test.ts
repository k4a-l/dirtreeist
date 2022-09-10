import dedent from 'ts-dedent'
import { convert } from '../src/modules/convert'

import { describe, it, expect } from 'vitest'

// @ts-ignore
import { dirTree, dirTreeRoot } from './resource/ditTree'

import {
  multipleTop,
  oneTop,
  bold,
  ascii,
  emptyLineBeforeUpperHierarchy,
  spaceBeforeName,
  spaceSize10,
  fullOption,
  spaceSize11,
  spaceSize11Ascii,
  // @ts-ignore
} from './resource/output'

describe('simple', () => {
  it('success', () => {
    expect(
      convert([
        { name: '/components', children: [] },
        { name: '/utils', children: [] },
      ])
    ).toBe(dedent`
  ├─/components
  └─/utils`)
  })
})

describe('multiple top', () => {
  it('success', () => {
    expect(convert(dirTree)).toBe(multipleTop)
  })
})

describe('only top', () => {
  it('success', () => {
    expect(convert(dirTreeRoot)).toBe(oneTop)
  })
})

describe('options', () => {
  it('treetype:1', () => {
    expect(convert(dirTree, { treeType: 'normal' })).toBe(multipleTop)
  })

  it('treetype:2', () => {
    expect(convert(dirTree, { treeType: 'bold' })).toBe(bold)
  })

  it('treetype:3', () => {
    expect(convert(dirTree, { treeType: 'ascii' })).toBe(ascii)
  })

  it('emptyLineBeforeUpperHierarchy:true', () => {
    expect(convert(dirTree, { emptyBeforeUpperHierarche: true })).toBe(
      emptyLineBeforeUpperHierarchy
    )
  })

  it('spaceBeforeName:true', () => {
    expect(convert(dirTree, { spaceBeforeName: true })).toBe(spaceBeforeName)
  })

  it('spaceSize:10', () => {
    expect(convert(dirTree, { spaceSize: 10 })).toBe(spaceSize10)
  })

  it('spaceSize:11', () => {
    expect(convert(dirTree, { spaceSize: 11 })).toBe(spaceSize11)
  })

  it('spaceSize:11 ascii', () => {
    expect(convert(dirTree, { spaceSize: 11, treeType: 'ascii' })).toBe(
      spaceSize11Ascii
    )
  })

  it('full option', () => {
    expect(
      convert(dirTree, {
        treeType: 'bold',
        spaceSize: 4,
        spaceBeforeName: true,
        emptyBeforeUpperHierarche: true,
      })
    ).toBe(fullOption)
  })
})
