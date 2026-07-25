import dedent from 'ts-dedent'

export const multipleTop = dedent`
├─/components
│　├─App.tsx
│　└─App.css
├─config.json
└─/utils
　　├─converter.ts
　　└─parser.ts`

export const oneTop = dedent`
/root
├─/components
│　├─App.tsx
│　└─App.css
├─config.json
└─/utils
　　├─converter.ts
　　└─parser.ts`


export const oneTopAscii = dedent`
/root
+--/components
|  +--App.tsx
|  +--App.css
+--config.json
+--/utils
   +--converter.ts
   +--parser.ts`

export const bold = dedent`
┣━/components
┃　┣━App.tsx
┃　┗━App.css
┣━config.json
┗━/utils
　　┣━converter.ts
　　┗━parser.ts`

export const ascii = dedent`
+--/components
|  +--App.tsx
|  +--App.css
+--config.json
+--/utils
   +--converter.ts
   +--parser.ts`

export const emptyLineBeforeUpperHierarchy = dedent`
├─/components
│　├─App.tsx
│　└─App.css
│
├─config.json
└─/utils
　　├─converter.ts
　　└─parser.ts`

export const spaceBeforeName = dedent`
├─ /components
│　├─ App.tsx
│　└─ App.css
├─ config.json
└─ /utils
　　├─ converter.ts
　　└─ parser.ts`

export const spaceSize10 = dedent`
├─────/components
│　　　　　├─────App.tsx
│　　　　　└─────App.css
├─────config.json
└─────/utils
　　　　　　├─────converter.ts
　　　　　　└─────parser.ts`


export const spaceSize11 = dedent`
├─────/components
│　　　　　 ├─────App.tsx
│　　　　　 └─────App.css
├─────config.json
└─────/utils
　　　　　　 ├─────converter.ts
　　　　　　 └─────parser.ts`


export const spaceSize11Ascii = dedent`
+-----------/components
|           +-----------App.tsx
|           +-----------App.css
+-----------config.json
+-----------/utils
            +-----------converter.ts
            +-----------parser.ts`

// メモは半角スペースで埋めるため、パディングの空白数を明示できるようjoinで組む
const memoLines = (paddings: [number, number, number, number, number]) =>
  [
    '├─/components' + ' '.repeat(paddings[0]) + 'UI',
    '│　├─App.tsx' + ' '.repeat(paddings[1]) + '入口',
    '│　└─App.css' + ' '.repeat(paddings[2]) + 'スタイル',
    '├─tsconfig.json' + ' '.repeat(paddings[3]) + '設定',
    '├─README.md' + ' '.repeat(paddings[4]) + '説明',
    '└─/utils',
  ].join('\n')

// 子要素を挟むので /components は単独グループ、tsconfig.json と README.md が同じグループ
export const memoAlignSiblings = memoLines([2, 2, 2, 2, 6])

export const memoAlignAll = memoLines([4, 4, 4, 2, 6])

export const memoAlignNone = memoLines([2, 2, 2, 2, 2])

// cjkFont:false では罫線を1幅として数えるので、揃え位置が変わる
export const memoAlignAllNarrowFont = memoLines([4, 5, 5, 2, 6])

// 既定のallでは全行が最長(├─tsconfig.json の17)に揃うので、そこからの差 + 5
export const memoGap5 = memoLines([7, 7, 7, 5, 9])

// 既定のallでは最長の '│　└─Button.tsx'(18) に全行が揃う。
// note行は子があるので '│　│'(6幅) まで罫線が伸び、18まで12 + memoGap分の2で14
export const noteAlignedToMemo = [
  '├─/components' + ' '.repeat(5) + 'UI',
  '│　│' + ' '.repeat(14) + '・ボタンとモーダル',
  '│　│' + ' '.repeat(14) + '　・Storybook対応',
  '│　│' + ' '.repeat(14) + '・PascalCase',
  '│　└─Button.tsx' + ' '.repeat(2) + '汎用',
  '└─config.json' + ' '.repeat(5) + '設定',
].join('\n')

// memo列に依存せず、罫線の直後に1段インデントして置く
export const noteNotAligned = [
  '├─/components' + ' '.repeat(5) + 'UI',
  '│　│' + '　・ボタンとモーダル',
  '│　│' + '　　・Storybook対応',
  '│　│' + '　・PascalCase',
  '│　└─Button.tsx' + ' '.repeat(2) + '汎用',
  '└─config.json' + ' '.repeat(5) + '設定',
].join('\n')

export const fullOption = dedent`
┣━━ /components
┃　　┣━━ App.tsx
┃　　┗━━ App.css
┃
┣━━ config.json
┗━━ /utils
　　　┣━━ converter.ts
　　　┗━━ parser.ts`
