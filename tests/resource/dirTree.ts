import { DirTree } from 'types'

export const dirTree: DirTree = [
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

export const dirTreeRoot: DirTree = [
  {
    name: '/root',
    children: dirTree,
  },
]

export const dirTreeWithNotes: DirTree = [
  {
    name: '/components',
    memo: 'UI',
    notes: [
      {
        text: 'ボタンとモーダル',
        children: [{ text: 'Storybook対応', children: [] }],
      },
      { text: 'PascalCase', children: [] },
    ],
    children: [
      {
        name: 'Button.tsx',
        memo: '汎用',
        children: [],
      },
    ],
  },
  {
    name: 'config.json',
    memo: '設定',
    children: [],
  },
]

export const dirTreeWithMemo: DirTree = [
  {
    name: '/components',
    memo: 'UI',
    children: [
      {
        name: 'App.tsx',
        memo: '入口',
        children: [],
      },
      {
        name: 'App.css',
        memo: 'スタイル',
        children: [],
      },
    ],
  },
  {
    name: 'tsconfig.json',
    memo: '設定',
    children: [],
  },
  {
    name: 'README.md',
    memo: '説明',
    children: [],
  },
  {
    name: '/utils',
    children: [],
  },
]
