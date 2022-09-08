import dedent from 'ts-dedent'

export const multiList = dedent`
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

export const includeExtraContent = dedent`
## list

- /components
    - App.tsx
    - App.css
- config.json
- /utils
    - >converter.ts
    - *p*arser.ts

## next
`

export const normalList = dedent`
- /components
    - App.tsx
    - App.css
- config.json
- /utils
    - converter.ts
    - parser.ts
`

export const markdownListWithAstarisc = dedent`
* /components
    * App.tsx
    * App.css
* config.json
* /utils
    * converter.ts
    * parser.ts
`

export const noList = dedent`
## list

## next
`
