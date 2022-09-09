const dirtreeist = require('@k4a_l/dirtreeist')

const markdown = `
- /components
    - App.tsx
    - App.css
- config.json
- /utils
    - converter.ts
    - parser.ts
`

const dirTrees = dirtreeist.parse(markdown) // markdown => DirTree[]

const options = {}
const outputs = dirTrees.map((dirTree) => dirtreeist.convert(dirTree, options)) // DirTree[] => output[]

console.log(outputs)

console.log(dirtreeist.default(markdown))

// 使うときはpackage.jsonのtype:moduleを消す
