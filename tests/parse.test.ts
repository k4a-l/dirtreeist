import { DirTree } from 'types'
import { parse } from '../src/modules/parse'

import { describe, it, expect } from 'vitest'

import {
  includeExtraContent,
  markdownListWithAstarisc,
  multiList,
  noList,
  normalList,
  // @ts-ignore
} from './resource/markdown'

const result: DirTree = [
  {
    name: '/components',
    children: [
      {
        name: 'App.tsx',
        children: [],
      },
      {
        name: 'App.css',
        children: [],
      },
    ],
  },
  {
    name: 'config.json',
    children: [],
  },
  {
    name: '/utils',
    children: [
      {
        name: 'converter.ts',
        children: [],
      },
      {
        name: 'parser.ts',
        children: [],
      },
    ],
  },
]

describe('success', () => {
  it('normal', async () => {
    expect(await parse(normalList)).toStrictEqual([result])
  })

  it('use *', () => {
    expect(parse(markdownListWithAstarisc)).toStrictEqual([result])
  })

  it('Include extras ', () => {
    expect(parse(includeExtraContent)).toStrictEqual([result])
  })

  it('Muitl list ', () => {
    expect(parse(multiList)).toStrictEqual([result, result])
  })

  it('No list ', () => {
    expect(parse(noList)).toStrictEqual([])
  })
})
