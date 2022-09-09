# DirTreeist

Create a directory Structure Diagram from a markdown lists.

## Installation

#### tarn

```shell
yarn add @k4a_l/dirtreeist
```

### npm

```shell
npm install @k4a_l/dirtreeist
```

## Example

### Input

```markdown
- /components
  - App.tsx
  - App.css
- config.json
- /utils
  - converter.ts
  - parser.ts
```

### Output

```text
├─/components
│  ├─App.tsx
│  └─App.css
├─config.json
└─/utils
    └─converter.ts
    └─parser.ts
```

## How to use

### TypeScript

```ts
const markdown = `
- /components
    - App.tsx
    - App.css
- config.json
- /utils
    - converter.ts
    - parser.ts
`
```

```tsx
import dirtreest, { Options } from '@k4a_l/dirtreeist'

const options: Options = {}
const outputs = dirtreest(markdown, options) // DirTree[] => output[]

console.log(outputs)
```

or

```tsx
import { parse, convert, Options } from '@k4a_l/dirtreeist'

const dirTrees = parse(markdown) // markdown => DirTree[]

const options: Options = {}
const outputs = dirTrees.map((dirTree) => convert(dirTree, options)) // DirTree[] => output[]

console.log(outputs)
```

### Type

#### Structure

```ts
type DirNode = {
  name: string
  children: DirNode[]
}

type DirTree = DirNode[]
```

#### Options

```ts
type Options = {
  treeType?: 'normal' | 'bold' | 'ascii'
  emptyBeforeUpperHierarche?: boolean
  spaceBeforeName?: boolean
  spaceSize?: number
}
```

### Description of options

#### treeType

default:`normal`

##### normal

```
│
├─
│
└─
```

##### bold

```
┃
┣━
┃
┗━
```

##### ascii

```
|
+
|
+-
```

#### emptyLineBeforeUpperHierarchy : boolean

default:`false`

##### true

```text
(true)
├─/components
│  ├─App.tsx
│  └─App.css
│
├─config.json
└─/utils
    └─converter.ts
    └─parser.ts
```

#### spaceBeforeName : boolean

default: `false`

##### true

```text
├─ /components
│  ├─ App.tsx
│  └─ App.css
├─ config.json
└─ /utils
    └─ converter.ts
    └─ parser.ts
```

#### spaceSize : number

default:`2`

##### 4

```text
├──/components
│    ├──App.tsx
│    └──App.css
├──config.json
└──/utils
      └──converter.ts
      └──parser.ts
```
