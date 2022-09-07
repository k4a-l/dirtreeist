# DirTreeist

マークダウンのリスト構造や DirTree 構造からディレクトリ構成図を作成します。

## Demo

### ディレクトリ構成図例

```text
├─/components
│  ├─App.tsx
│  └─App.css
├─config.json
└─/utils
    └─converter.ts
```

## DirTree 構造

```ts
type DirNode = {
  name: string
  children: DirNode[]
}

type DirTree = DirNode[]
```

## 使い方

### TypeScript Module

```ts
import { parse, converter, OptionType } from 'dirTreeist'

const markdownList = `
- /components
    - App.tsx
    - App.css
- config.json
- /utils
    - converter.ts
`

const dirTree = parse(markdownList) // markdown => DirTree

const options: OptionType = {}
const output = converter(dirtree, options) // DirTree => output(like Demo)
```

#### オプション

```ts
type Options = {
  treeType?: 'normal' | 'bold' | 'ascii'
  emptyBeforeUpperHierarche?: boolean
  spaceBeforeName?: boolean
  spaceSize?: number
}
```

### CLI

```shell
dirTreeist <inputFile> [...options]
```

#### オプション

```test
-t, --treeType ['normal'|'bold'|'ascii']
-e, --empty [boolean]
-space, --spaceBeforeName [boolean]
-size, --spaceSize [number]
```

### オプションの説明

#### treeType

デフォルト値:normal

normal

```
│
├─
│
└─
```

bold

```
┃
┣━
┃
┗━
```

ascii

```
|
+
|
+-
```

#### emptyLineBeforeUpperHierarchy : boolean

デフォルト値:false

```text
(true)
├─/components
│  ├─App.tsx
│  └─App.css
│
├─config.json
└─/utils
    └─converter.ts
```

#### spaceBeforeName : boolean

デフォルト値:false

```text
(true)
├─ /components
│  ├─ App.tsx
│  └─ App.css
├─ config.json
└─ /utils
│  └─ converter.ts
```

#### spaceSize : number

デフォルト値:2

```text
(4)
├──/components
│    ├── App.tsx
│    └── App.css
├── config.json
└──/utils
     └── converter.ts
```
