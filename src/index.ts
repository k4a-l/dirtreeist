import { parse } from './modules/parse.js'
import { convert, layout, lineToString } from './modules/convert.js'

import {
  DirNode,
  DirTree,
  NoteNode,
  Line,
  NodeLine,
  NoteLine,
  EmptyLine,
  Options,
} from './types/index'
import {
  symbolSets,
  defaultOptions,
  treeTypeValues,
  memoAlignValues,
} from './constants/constant.js'

const dirtreeist = (markdown: string, option?: Options) => {
  return parse(markdown, option).map((dirtree) => convert(dirtree, option))
}

export {
  parse,
  convert,
  layout,
  lineToString,
  symbolSets,
  defaultOptions,
  treeTypeValues,
  memoAlignValues,
}
export default dirtreeist
export type {
  DirNode,
  DirTree,
  NoteNode,
  Line,
  NodeLine,
  NoteLine,
  EmptyLine,
  Options,
}
