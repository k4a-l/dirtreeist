import { parse } from './modules/parse.js'
import { convert } from './modules/convert.js'

import { DirTree, Options } from './types/index'
import { symbolSets } from './constants/constant.js'

const dirtreeist = (markdown: string, option?: Options) => {
  return parse(markdown).map((dirtree) => convert(dirtree, option))
}

export { parse, convert, symbolSets }
export default dirtreeist
export type { DirTree, Options }
