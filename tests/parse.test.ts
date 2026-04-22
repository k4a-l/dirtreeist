import { DirTree } from 'types'
import { parse } from 'modules/parse'

import { describe, it, expect } from 'vitest'

import {
  includeExtraContent,
  markdownListWithAstarisc,
  multiList,
  noList,
  normalList,
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

  it('keepMarkdown: true', () => {
    const md = '- **bold**\n- *italic*'
    const expected: DirTree = [
      { name: '**bold**', children: [] },
      { name: '*italic*', children: [] },
    ]
    expect(parse(md, { keepMarkdown: true })).toStrictEqual([expected])
  })

  it('keepMarkdown: link', () => {
    const md = '- [Google](https://google.com)'
    const expected: DirTree = [{ name: '[Google](https://google.com)', children: [] }]
    expect(parse(md, { keepMarkdown: true })).toStrictEqual([expected])
  })

  it('keepMarkdown: false (default)', () => {
    const md = '- **bold** item\n- [Google](https://google.com)'
    const expected: DirTree = [
      { name: 'bold item', children: [] },
      { name: 'Google', children: [] },
    ]
    expect(parse(md)).toStrictEqual([expected])
  })
})
