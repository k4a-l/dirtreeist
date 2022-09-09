import { parse } from './modules/parse'
import { convert } from './modules/convert'

import { DirTree, Options } from './types/index'

const dirtreest = (markdown: string, option?: Options) => {
  return parse(markdown).map((dirtree) => convert(dirtree, option))
}

export { parse, convert }
export default dirtreest
export type { DirTree, Options }
