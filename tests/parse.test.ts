import dedent from 'ts-dedent'
import { DirTree } from 'types'
import { parse } from '../src/modules/parse'

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
  test('normal', () => {
    const markdownList = dedent`
- /components
    - App.tsx
    - App.css
- config.json
- /utils
    - converter.ts
    - parser.ts
`
    expect(parse(markdownList)).toStrictEqual([result])
  })

  test('use *', () => {
    const markdownList = dedent`
* /components
    * App.tsx
    * App.css
* config.json
* /utils
    * converter.ts
    * parser.ts
`
    expect(parse(markdownList)).toStrictEqual([result])
  })

  test('Include extras ', () => {
    const markdownList = dedent`
## list

- /components
    - App.tsx
    - App.css
- config.json
- /utils
    - converter.ts
    - parser.ts

## next
`
    expect(parse(markdownList)).toStrictEqual([result])
  })

  test('Muitl list ', () => {
    const markdownList = dedent`
## list

- /components
    - App.tsx
    - App.css
- config.json
- /utils
    - converter.ts
    - parser.ts

## next

- /components
    - App.tsx
    - App.css
- config.json
- /utils
    - converter.ts
    - parser.ts
`
    expect(parse(markdownList)).toStrictEqual([result, result])
  })

  test('No list ', () => {
    const markdownList = dedent`
## list

## next

`
    expect(parse(markdownList)).toStrictEqual([])
  })
})
