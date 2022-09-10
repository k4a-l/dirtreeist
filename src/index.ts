import { parse } from './modules/parse.js'
import { convert } from './modules/convert.js'

import { DirTree, Options } from './types/index'

const dirtreeist = (markdown: string, option?: Options) => {
  return parse(markdown).map((dirtree) => convert(dirtree, option))
}

export { parse, convert }
export default dirtreeist
export type { DirTree, Options }
