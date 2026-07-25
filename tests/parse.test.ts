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

describe('delimiter', () => {
  it('false (default): メモを分割しない', () => {
    const md = '- dir # memo'
    expect(parse(md)).toStrictEqual([[{ name: 'dir # memo', children: [] }]])
  })

  it('名前とメモに分割する', () => {
    const md = '- dir # memo'
    expect(parse(md, { delimiter: '#' })).toStrictEqual([
      [{ name: 'dir', memo: 'memo', children: [] }],
    ])
  })

  it('名前に空白を含められる', () => {
    const md = '- My Documents # 書類'
    expect(parse(md, { delimiter: '#' })).toStrictEqual([
      [{ name: 'My Documents', memo: '書類', children: [] }],
    ])
  })

  it('2つめ以降の区切り文字はメモに含む', () => {
    const md = '- dir ## memo'
    expect(parse(md, { delimiter: '#' })).toStrictEqual([
      [{ name: 'dir', memo: '# memo', children: [] }],
    ])
  })

  it('メモが空ならmemoを持たない', () => {
    const md = '- dir #'
    expect(parse(md, { delimiter: '#' })).toStrictEqual([
      [{ name: 'dir', children: [] }],
    ])
  })

  it('子要素にもメモを付けられる', () => {
    const md = '- dir # memo\n  - child # child memo'
    expect(parse(md, { delimiter: '#' })).toStrictEqual([
      [
        {
          name: 'dir',
          memo: 'memo',
          children: [{ name: 'child', memo: 'child memo', children: [] }],
        },
      ],
    ])
  })

  it('リンクのURL内の区切り文字では分割しない', () => {
    const md = '- [Google](https://google.com/#hash) # memo'
    expect(parse(md, { delimiter: '#' })).toStrictEqual([
      [{ name: 'Google', memo: 'memo', children: [] }],
    ])
  })

  it('コードスパン内の区切り文字では分割しない', () => {
    const md = '- `C#` # memo'
    expect(parse(md, { delimiter: '#' })).toStrictEqual([
      [{ name: 'C#', memo: 'memo', children: [] }],
    ])
  })

  it('エスケープされた区切り文字では分割しない', () => {
    const md = '- a\\#b # memo'
    expect(parse(md, { delimiter: '#' })).toStrictEqual([
      [{ name: 'a#b', memo: 'memo', children: [] }],
    ])
  })

  it('区切り文字は変更できる', () => {
    const md = '- dir // memo'
    expect(parse(md, { delimiter: '//' })).toStrictEqual([
      [{ name: 'dir', memo: 'memo', children: [] }],
    ])
  })

  it('名前が空の行はnotesに移す', () => {
    const md = '- dir -- 直接\n  - -- 詳細1\n  - -- 詳細2'
    expect(parse(md, { delimiter: '--' })).toStrictEqual([
      [
        {
          name: 'dir',
          memo: '直接',
          children: [],
          notes: [
            { text: '詳細1', children: [] },
            { text: '詳細2', children: [] },
          ],
        },
      ],
    ])
  })

  it('noteの階層を保つ', () => {
    const md = '- dir\n  - -- 親メモ\n    - -- 子メモ'
    expect(parse(md, { delimiter: '--' })).toStrictEqual([
      [
        {
          name: 'dir',
          children: [],
          notes: [
            { text: '親メモ', children: [{ text: '子メモ', children: [] }] },
          ],
        },
      ],
    ])
  })

  it('noteの子は名前を持っていてもnote扱いにする', () => {
    const md = '- dir\n  - -- メモ\n    - 名前つき'
    expect(parse(md, { delimiter: '--' })).toStrictEqual([
      [
        {
          name: 'dir',
          children: [],
          notes: [
            { text: 'メモ', children: [{ text: '名前つき', children: [] }] },
          ],
        },
      ],
    ])
  })

  it('noteと実ノードが混在しても順序を保つ', () => {
    const md = '- dir\n  - a.txt\n  - -- メモ1\n  - b.txt\n  - -- メモ2'
    expect(parse(md, { delimiter: '--' })).toStrictEqual([
      [
        {
          name: 'dir',
          children: [
            { name: 'a.txt', children: [] },
            { name: 'b.txt', children: [] },
          ],
          notes: [
            { text: 'メモ1', children: [] },
            { text: 'メモ2', children: [] },
          ],
        },
      ],
    ])
  })

  it('delimiterがfalseならnotesを作らない', () => {
    const md = '- dir\n  - -- メモ'
    expect(parse(md)).toStrictEqual([
      [{ name: 'dir', children: [{ name: '-- メモ', children: [] }] }],
    ])
  })

  it('keepMarkdown: true と併用できる', () => {
    const md = '- **bold** # *memo*'
    expect(parse(md, { delimiter: '#', keepMarkdown: true })).toStrictEqual([
      [{ name: '**bold**', memo: '*memo*', children: [] }],
    ])
  })
})
