# DirTreeist

Create a directory Structure Diagram from a markdown lists.

## Installation

```shell
yarn add @k4a_l/dirtreeist
npm install @k4a_l/dirtreeist
```

## Demo

https://www.k4a.me/tools/dirtreeist

## Example

### Basic

#### Input

```markdown
- /components
  　- App.tsx
  　- App.css
- config.json
- /utils
  　- converter.ts
  　- parser.ts
```

#### Output

```text
├─/components
│　├─App.tsx
│　└─App.css
├─config.json
└─/utils
　　└─converter.ts
　　└─parser.ts
```

### Only one top

#### Input

```markdown
- /root
  - /components
    　- App.tsx
    　- App.css
  - config.json
  - /utils
    　- converter.ts
    　- parser.ts
```

#### Output

```text
/root
├─/components
│　├─App.tsx
│　└─App.css
├─config.json
└─/utils
　　├─converter.ts
　　└─parser.ts
```

### Sequential listings

Consecutive lists are connected.

#### Input

```

- a
  - b
  - c
- d

- 1
  - 2
    - 3
      - 4

```

#### Output

```

├─ a
│ 　 ├─ b
│ 　 └─ c
├─ d
└─ 1
　　 └─ 2
　　　　 └─ 3
　　　　　　 └─ 4

```

### Another element comes in between

If another element is sandwiched in between, a "only" split lists is output.

#### Input

```dirtree
- a
  - b
  - c
- d

sometext

- 1
  - 2
    - 3
      - 4
```

#### Output

```
├─ a
│　├─ b
│　└─ c
└─ d
```

```
└─ 1
　　└─ 2
　　　　└─ 3
　　　　　　└─ 4
```

### Memo and note

Set `delimiter` and the text after it becomes a **memo**, lined up in a column.

An item with **no name, only a memo** is not a directory. It is a **note** belonging to its parent, so longer remarks can be written as an outline without adding fake entries to the tree. Children of a note are notes too, even if they have a name.

#### Input

```markdown
- /components -- UI
  - -- has buttons and modals
    - -- Storybook ready
  - App.tsx -- entry point
  - App.css -- style
- tsconfig.json -- settings
- README.md -- docs
- /utils
```

#### Output (`{ delimiter: '--' }`)

```text
├─/components    UI
│　│             ・has buttons and modals
│　│             　・Storybook ready
│　├─App.tsx    entry point
│　└─App.css    style
├─tsconfig.json  settings
├─README.md      docs
└─/utils
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
import dirtreeist, { Options } from '@k4a_l/dirtreeist'

const options: Options = {}
const outputs = dirtreeist(markdown, options) // DirTree[] => output[]
```

or

```tsx
import { parse, convert, Options } from '@k4a_l/dirtreeist'

const dirTrees = parse(markdown) // markdown => DirTree[]

const options: Options = {}
const outputs = dirTrees.map((dirTree) => convert(dirTree, options)) // DirTree[] => output[]
```

### Custom rendering

To style parts of the output yourself, use `layout` instead of `convert`. It returns the same result as flat, already-aligned line data — `'node'`, `'note'` or `'empty'`, each split into branch / name / padding / memo, plus the source `DirNode`.

```tsx
import { layout } from '@k4a_l/dirtreeist'

layout(dirTree, options).map((line, i) =>
  line.type === 'node' ? (
    <div key={i}>
      <span className="branch">{line.branch}</span>
      <span onClick={() => select(line.node)}>{line.name}</span>
      {line.gap}
      <span className="memo">{line.memo}</span>
    </div>
  ) : (
    ...
  )
)
```

Padding comes as ready-made strings rather than widths, so you never count characters yourself. Joining every field of a line gives back exactly what `convert` outputs:

```ts
convert(dirTree, options) === layout(dirTree, options).map(lineToString).join('\n')
```

That padding only holds in monospace. If names and memos get different fonts or sizes, ignore `gap` and lay the fields out with CSS instead.

### Type

See [src/types/index.ts](src/types/index.ts)

### Options

#### treeType

default:`normal`

##### normal

```
│
├─
└─
```

##### bold

```
┃
┣━
┗━
```

##### ascii

```
|
+-
```

#### emptyLineBeforeUpperHierarchy : boolean

default:`false`

##### true

```text
(true)
├─/components
│　├─App.tsx
│
├─config.json
└─/utils
　　└─parser.ts
```

#### spaceBeforeName : boolean

default: `false`

##### true

```text
├─ /components
│　├─ App.tsx
├─ config.json
└─ /utils
　　└─ parser.ts
```

#### spaceSize : number

default:`2`

##### 4

```text
├──/components
│　　├──App.tsx
├──config.json
└──/utils
　　　└──parser.ts
```

#### keepMarkdown : boolean

default:`false`

Whether to keep markdown notation in lists.

##### true

```text
Input:
- **bold**
- [google](https://google.com)

Output:
├─**bold**
└─[google](https://google.com)
```

#### delimiter : string | false

default: `false`

Separates a name from its memo; `false` disables memos.

Splits at the first occurrence; later ones stay in the memo. Occurrences inside link URLs, code spans and escapes (`\`) are skipped, so names can contain the delimiter.

#### memoAlign : 'all' | 'siblings' | 'none'

default: `all`

```text
all                             siblings
├─/components    UI             ├─/components  UI
│　├─A.tsx      entry          │　├─A.tsx  entry
│　└─A.css      style          │　└─A.css  style
├─tsconfig.json  settings       ├─tsconfig.json  settings
├─README.md      docs           ├─README.md      docs
└─/utils                        └─/utils
```

#### memoGap : number

default: `2`

Minimum number of half-width spaces between a name and its memo.

#### memoMaxColumn : number | false

default: `false`

Lines wider than this stop deciding the memo column, so one long name cannot drag every memo right. A ceiling on who *decides* the column, not a width it is padded out to.

```text
false                                20
├─a                        short   ├─a  short
├─b                        short   ├─b  short
├─/very/deeply/nested/dir  long    ├─/very/deeply/nested/dir  long
└─c                        short   └─c  short
```

#### noteAlignToMemo : boolean

default: `true`

Whether notes line up with the memo column. `false` puts them right after the branch, which holds up better with deep trees or long notes.

```text
true                              false
├─/components  UI                 ├─/components  UI
│　│           ・has buttons      │　│　・has buttons
│　│           　・Storybook      │　│　　・Storybook
│　└─Button.tsx  generic          │　└─Button.tsx  generic
```

#### noteBullet : string

default: `・`

The mark in front of each note line. An empty string removes it.

#### noteIndentSize : number

default: `2`

Indent width of one note level, in half-width spaces.

#### cjkFont : boolean

default: `true`

Box drawing characters are full-width in CJK fonts, half-width elsewhere. Set `false` for the latter.

> Alignment assumes monospace, and counts `keepMarkdown` names by their rendered length (`**bold**` is 4).
