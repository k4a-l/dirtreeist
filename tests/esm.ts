import dirtreeist, { parse, convert } from '../src/index'

const markdown = `
- /components
    - App.tsx
    - App.css
- config.json
- /utils
    - converter.ts
    - parser.ts
`

const dirTrees = parse(markdown) // markdown => DirTree[]

const options = {}
const outputs = dirTrees.map((dirTree) => convert(dirTree, options)) // DirTree[] => output[]

console.log(outputs)

console.log(dirtreeist(markdown))
