import dedent from 'ts-dedent'

export const multipleTop = dedent`
├─/components
│  ├─App.tsx
│  └─App.css
├─config.json
└─/utils
    ├─converter.ts
    └─parser.ts`

export const oneTop = dedent`
└─/root
    ├─/components
    │  ├─App.tsx
    │  └─App.css
    ├─config.json
    └─/utils
        ├─converter.ts
        └─parser.ts`

export const bold = dedent`
┣━/components
┃  ┣━App.tsx
┃  ┗━App.css
┣━config.json
┗━/utils
    ┣━converter.ts
    ┗━parser.ts`

export const ascii = dedent`
+-/components
|  +-App.tsx
|  +-App.css
+-config.json
+-/utils
   +-converter.ts
   +-parser.ts`

export const emptyLineBeforeUpperHierarchy = dedent`
├─/components
│  ├─App.tsx
│  └─App.css
│
├─config.json
└─/utils
    ├─converter.ts
    └─parser.ts`

export const spaceBeforeName = dedent`
├─ /components
│  ├─ App.tsx
│  └─ App.css
├─ config.json
└─ /utils
    ├─ converter.ts
    └─ parser.ts`

export const spaceSize10 = dedent`
├─────/components
│          ├─────App.tsx
│          └─────App.css
├─────config.json
└─────/utils
            ├─────converter.ts
            └─────parser.ts`


export const spaceSize11 = dedent`
├─────/components
│           ├─────App.tsx
│           └─────App.css
├─────config.json
└─────/utils
             ├─────converter.ts
             └─────parser.ts`

export const fullOption = dedent`
┣━━ /components
┃    ┣━━ App.tsx
┃    ┗━━ App.css
┃
┣━━ config.json
┗━━ /utils
      ┣━━ converter.ts
      ┗━━ parser.ts`
