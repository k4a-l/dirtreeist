import dedent from 'ts-dedent'
import { convert, layout, lineToString } from '../src/modules/convert'

import { describe, it, expect } from 'vitest'

// @ts-ignore
import {
  dirTree,
  dirTreeRoot,
  dirTreeWithMemo,
  dirTreeWithNotes,
} from './resource/dirTree'

import {
  multipleTop,
  oneTop,
  oneTopAscii,
  bold,
  ascii,
  emptyLineBeforeUpperHierarchy,
  spaceBeforeName,
  spaceSize10,
  fullOption,
  spaceSize11,
  spaceSize11Ascii,
  memoAlignSiblings,
  memoAlignAll,
  memoAlignNone,
  memoAlignAllNarrowFont,
  memoGap5,
  noteAlignedToMemo,
  noteNotAligned,
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
  it('normal', () => {
    expect(convert(dirTreeRoot)).toBe(oneTop)
  })

  it('ascii', () => {
    expect(convert(dirTreeRoot, { treeType: 'ascii' })).toBe(oneTopAscii)
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
    expect(convert(dirTree, { emptyBeforeUpperHierarchy: true })).toBe(
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

  it('spaceSize:0', () => {
    expect(convert(dirTree, { spaceSize: 0 })).toBe(multipleTop)
  })

  it('spaceSize:-1', () => {
    expect(convert(dirTree, { spaceSize: -1 })).toBe(multipleTop)
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
        emptyBeforeUpperHierarchy: true,
      })
    ).toBe(fullOption)
  })

  it('memoAlign:all (default)', () => {
    expect(convert(dirTreeWithMemo)).toBe(memoAlignAll)
  })

  it('memoAlign:siblings', () => {
    expect(convert(dirTreeWithMemo, { memoAlign: 'siblings' })).toBe(
      memoAlignSiblings
    )
  })

  it('memoAlign:none', () => {
    expect(convert(dirTreeWithMemo, { memoAlign: 'none' })).toBe(memoAlignNone)
  })

  it('cjkFont:false', () => {
    expect(
      convert(dirTreeWithMemo, { memoAlign: 'all', cjkFont: false })
    ).toBe(memoAlignAllNarrowFont)
  })

  it('memoGap:5', () => {
    expect(convert(dirTreeWithMemo, { memoGap: 5 })).toBe(memoGap5)
  })

  it('memoMaxColumn: 上限を超える行は揃えから外す', () => {
    const tree = [
      { name: 'a', memo: '短い', children: [] },
      { name: '/very/deeply/nested/dir', memo: '長い', children: [] },
      { name: 'b', memo: '短い2', children: [] },
    ]

    // 上限なし(既定)では長い行(2+23=25)に全行が引きずられる
    expect(convert(tree)).toBe(
      [
        '├─a' + ' '.repeat(24) + '短い',
        '├─/very/deeply/nested/dir' + ' '.repeat(2) + '長い',
        '└─b' + ' '.repeat(24) + '短い2',
      ].join('\n')
    )

    // 上限を10にすると長い行だけが外れ、残りは自分たちの最長(3)に揃う
    expect(convert(tree, { memoMaxColumn: 10 })).toBe(
      [
        '├─a' + ' '.repeat(2) + '短い',
        '├─/very/deeply/nested/dir' + ' '.repeat(2) + '長い',
        '└─b' + ' '.repeat(2) + '短い2',
      ].join('\n')
    )
  })

  it('memoMaxColumn: 全行が上限以下なら影響しない', () => {
    expect(convert(dirTreeWithMemo, { memoMaxColumn: 1000 })).toBe(memoAlignAll)
  })

  it('noteAlignToMemo:true (default)', () => {
    expect(convert(dirTreeWithNotes)).toBe(noteAlignedToMemo)
  })

  it('noteAlignToMemo:false', () => {
    expect(convert(dirTreeWithNotes, { noteAlignToMemo: false })).toBe(
      noteNotAligned
    )
  })

  it('noteの下に子要素が続くときは縦線を繋げる', () => {
    expect(
      convert([
        {
          name: 'dir',
          notes: [{ text: 'm', children: [] }],
          children: [{ name: 'child.txt', children: [] }],
        },
        { name: 'other', children: [] },
      ])
    ).toBe(
      [
        '├─dir',
        '│　│' + ' '.repeat(2) + '・m',
        '│　└─child.txt',
        '└─other',
      ].join('\n')
    )
  })

  it('子要素がなければ縦線を足さない', () => {
    expect(
      convert([
        { name: 'dir', notes: [{ text: 'm', children: [] }], children: [] },
        { name: 'other', children: [] },
      ])
    ).toBe(
      ['├─dir', '│　' + ' '.repeat(2) + '・m', '└─other'].join('\n')
    )
  })

  it('noteBullet は変更できる', () => {
    expect(
      convert([{ name: 'dir', notes: [{ text: 'm', children: [] }], children: [] }], {
        noteBullet: '* ',
      })
    ).toBe(['dir', ' '.repeat(2) + '* m'].join('\n'))
  })

  it('keepMarkdown:true では記法の分を幅から差し引く', () => {
    // レンダリング後は bold / Google / code.ts なので、その表示幅で揃える
    expect(
      convert(
        [
          { name: '**bold**', memo: 'a', children: [] },
          { name: '[Google](https://google.com/x)', memo: 'b', children: [] },
          { name: '`code.ts`', memo: 'c', children: [] },
        ],
        { keepMarkdown: true }
      )
    ).toBe(
      [
        // 罫線2幅 + レンダリング後の文字数。最長は `code.ts` の 2 + 7 = 9
        '├─**bold**' + ' '.repeat(5) + 'a', // 2 + 4 = 6
        '├─[Google](https://google.com/x)' + ' '.repeat(3) + 'b', // 2 + 6 = 8
        '└─`code.ts`' + ' '.repeat(2) + 'c', // 2 + 7 = 9
      ].join('\n')
    )
  })

  it('keepMarkdown:false では名前をそのまま数える', () => {
    expect(
      convert([
        { name: '**bold**', memo: 'a', children: [] },
        { name: 'plain', memo: 'b', children: [] },
      ])
    ).toBe(
      ['├─**bold**' + ' '.repeat(2) + 'a', '└─plain' + ' '.repeat(5) + 'b'].join(
        '\n'
      )
    )
  })

  it('メモがなければ何も付かない', () => {
    expect(convert(dirTree, { memoAlign: 'all' })).toBe(multipleTop)
  })

  it('invalid option', () => {
    expect(
      convert(dirTree, {
        // @ts-ignore
        treeType: 'b',
        spaceSize: -1,
        // @ts-ignore
        spaceBeforeName: '',
        // @ts-ignore
        emptyBeforeUpperHierarchy: '',
      })
    ).toBe(multipleTop)
  })
})

describe('layout', () => {
  it('罫線・名前・空白・メモが分かれて出る', () => {
    const lines = layout([
      { name: 'dir', memo: 'メモ', children: [] },
      { name: 'longer.txt', memo: 'メモ2', children: [] },
    ])

    expect(lines).toStrictEqual([
      {
        type: 'node',
        branch: '├─',
        name: 'dir',
        gap: ' '.repeat(9),
        memo: 'メモ',
        node: { name: 'dir', memo: 'メモ', children: [] },
        hierarchy: 0,
      },
      {
        type: 'node',
        branch: '└─',
        name: 'longer.txt',
        gap: ' '.repeat(2),
        memo: 'メモ2',
        node: { name: 'longer.txt', memo: 'メモ2', children: [] },
        hierarchy: 0,
      },
    ])
  })

  it('メモがない行はgapが空でmemoを持たない', () => {
    const lines = layout([{ name: 'dir', children: [] }])
    expect(lines[0]).toStrictEqual({
      type: 'node',
      branch: '',
      name: 'dir',
      gap: '',
      node: { name: 'dir', children: [] },
      hierarchy: 0,
    })
  })

  it('hierarchyは階層の深さを返す', () => {
    const lines = layout([
      { name: 'a', children: [{ name: 'b', children: [{ name: 'c', children: [] }] }] },
    ])
    expect(lines.map((line) => line.type === 'node' && line.hierarchy)).toStrictEqual([
      0, 1, 2,
    ])
  })

  it('noteの行が分かれて出る', () => {
    const node = {
      name: 'dir',
      notes: [{ text: 'm', children: [] }],
      children: [],
    }
    const lines = layout([node])

    expect(lines[1]).toStrictEqual({
      type: 'note',
      branch: '',
      gap: ' '.repeat(2),
      indent: '',
      bullet: '・',
      text: 'm',
      depth: 0,
      node,
      noteNode: { text: 'm', children: [] },
    })
  })

  it('空行はtype:emptyになる', () => {
    const lines = layout(dirTree, { emptyBeforeUpperHierarchy: true })
    expect(lines.filter((line) => line.type === 'empty')).toStrictEqual([
      { type: 'empty', branch: '│' },
    ])
  })

  it('元のDirNodeを参照できる', () => {
    const child = { name: 'child.txt', children: [] }
    const lines = layout([{ name: 'dir', children: [child] }])
    expect(lines[1].type === 'node' && lines[1].node).toBe(child)
  })

  it('lineToStringで繋ぐとconvertと一致する', () => {
    const options = { memoDelimiter: '--' as const, noteAlignToMemo: false as const }
    expect(
      layout(dirTreeWithNotes, options).map(lineToString).join('\n')
    ).toBe(convert(dirTreeWithNotes, options))
  })
})
