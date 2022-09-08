import dedent from 'ts-dedent'
import { DirTree } from 'types'
import { parse } from '../src/modules/parse'

import { describe, it, expect } from 'vitest'

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
    const markdownList = dedent`
- /components
    - App.tsx
    - App.css
- config.json
- /utils
    - converter.ts
    - parser.ts
`

    expect(await parse(markdownList)).toStrictEqual([result])
  })

  it('use *', () => {
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

    it('Include extras ', () => {
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

    it('Muitl list ', () => {
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

    it('No list ', () => {
      const markdownList = dedent`
  ## list

  ## next

  `
      expect(parse(markdownList)).toStrictEqual([])
    })
})
