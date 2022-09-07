import dedent from 'ts-dedent'
import { DirTree } from 'types'
import { convert } from '../src/modules/convert'

const dirTree: DirTree = [
  {
    name: 'components',
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
    name: 'utils',
    children: [
      {
        name: 'converter.ts',
        children: [],
      },
    ],
  },
]

const dirTreeRoot: DirTree = [
  {
    name: 'root',
    children: dirTree,
  },
]

describe('multiple top', () => {
  test('success', () => {
    expect(convert(dirTree)).toBe(dedent`
├─/components
│  ├─App.tsx
│  └─App.css
├─config.json
└─/utils
    └─converter.ts`)
  })
})

describe('only top', () => {
  test('success', () => {
    expect(convert(dirTreeRoot)).toBe(dedent`
/root
├─/components
│  ├─App.tsx
│  └─App.css
├─config.json
└─/utils
    └─converter.ts`)
  })
})

describe('options', () => {
  test('treetype:1', () => {
    expect(convert(dirTree, { treeType: 'normal' })).toBe(dedent`
├─/components
│  ├─App.tsx
│  └─App.css
├─config.json
└─/utils
    └─converter.ts`)
  })

  test('treetype:2', () => {
    expect(convert(dirTree, { treeType: 'bold' })).toBe(dedent`
┣━/components
┃  ┣━App.tsx
┃  ┗━App.css
┣━config.json
┗━━/utils
    ┗━converter.ts`)
  })

  test('treetype:3', () => {
    expect(convert(dirTree, { treeType: 'ascii' })).toBe(dedent`
|-/components
|  |-App.tsx
|  +-App.css
|
|-config.json
+-/utils
   +-converter.ts`)
  })

  test('emptyLineBeforeUpperHierarchy:true', () => {
    expect(convert(dirTree, { emptyBeforeUpperHierarche: true })).toBe(dedent`
├─/components
│  ├─App.tsx
│  └─App.css
│
├─config.json
└─/utils
    └─converter.ts`)
  })

  test('spaceBeforeName:true', () => {
    expect(convert(dirTree, { spaceBeforeName: true })).toBe(dedent`
├─ /components
│  ├─ App.tsx
│  └─ App.css
├─ config.json
└─ /utils
    └─ converter.ts`)
  })

  test('spaceBeforeName:true', () => {
    expect(convert(dirTree, { spaceSize: 4 })).toBe(dedent`
├────/components
│    ├── App.tsx
│    └── App.css
├──── config.json
└────/utils
      └── converter.ts`)
  })
})
