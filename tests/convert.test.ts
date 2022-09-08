import dedent from 'ts-dedent'
import { DirTree } from 'types'
import { convert } from '../src/modules/convert'

import { describe, it, expect } from 'vitest'

const dirTree: DirTree = [
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

const dirTreeRoot: DirTree = [
  {
    name: '/root',
    children: dirTree,
  },
]

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
    expect(convert(dirTree)).toBe(dedent`
├─/components
│  ├─App.tsx
│  └─App.css
├─config.json
└─/utils
    ├─converter.ts
    └─parser.ts`)
  })
})

describe('only top', () => {
  it('success', () => {
    expect(convert(dirTreeRoot)).toBe(dedent`
└─/root
    ├─/components
    │  ├─App.tsx
    │  └─App.css
    ├─config.json
    └─/utils
        ├─converter.ts
        └─parser.ts`)
  })
})

describe('options', () => {
  it('treetype:1', () => {
    expect(convert(dirTree, { treeType: 'normal' })).toBe(dedent`
├─/components
│  ├─App.tsx
│  └─App.css
├─config.json
└─/utils
    ├─converter.ts
    └─parser.ts`)
  })

  it('treetype:2', () => {
    expect(convert(dirTree, { treeType: 'bold' })).toBe(dedent`
┣━/components
┃  ┣━App.tsx
┃  ┗━App.css
┣━config.json
┗━/utils
    ┣━converter.ts
    ┗━parser.ts`)
  })

  it('treetype:3', () => {
    expect(convert(dirTree, { treeType: 'ascii' })).toBe(dedent`
+-/components
|  +-App.tsx
|  +-App.css
+-config.json
+-/utils
   +-converter.ts
   +-parser.ts`)
  })

  it('emptyLineBeforeUpperHierarchy:true', () => {
    expect(convert(dirTree, { emptyBeforeUpperHierarche: true })).toBe(dedent`
├─/components
│  ├─App.tsx
│  └─App.css
│
├─config.json
└─/utils
    ├─converter.ts
    └─parser.ts`)
  })

  it('spaceBeforeName:true', () => {
    expect(convert(dirTree, { spaceBeforeName: true })).toBe(dedent`
├─ /components
│  ├─ App.tsx
│  └─ App.css
├─ config.json
└─ /utils
    ├─ converter.ts
    └─ parser.ts`)
  })

  it('spaceSize:4', () => {
    expect(convert(dirTree, { spaceSize: 4 })).toBe(dedent`
├──/components
│    ├──App.tsx
│    └──App.css
├──config.json
└──/utils
      ├──converter.ts
      └──parser.ts`)
  })

  it('full option', () => {
    expect(
      convert(dirTree, {
        treeType: 'bold',
        spaceSize: 4,
        spaceBeforeName: true,
        emptyBeforeUpperHierarche: true,
      })
    ).toBe(dedent`
┣━━ /components
┃    ┣━━ App.tsx
┃    ┗━━ App.css
┃
┣━━ config.json
┗━━ /utils
      ┣━━ converter.ts
      ┗━━ parser.ts`)
  })
})
