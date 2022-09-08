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
