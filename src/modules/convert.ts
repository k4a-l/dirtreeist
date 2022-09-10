import { symbolSets, defaultOptions } from 'constants/constant.js'
import { DirTree, Options, OptionsBase, SymbolSet } from 'types/index'
import { buildOption } from './options.js'

const makeSymbol = (symbolSet: SymbolSet, isLast: boolean): string => {
  if (isLast) return symbolSet.end
  return symbolSet.crossing
}

const reduce = (
  dirTree: DirTree,
  options: OptionsBase,
  prefix: string,
  hie: number,
  isLastGroup: boolean
): string => {
  let result = ``
  dirTree.some((dirNode, dirNodeIndex) => {
    // 準備
    const isLast = dirNodeIndex == dirTree.length - 1
    const symbolSet = symbolSets[options.treeType]
    const symbol = makeSymbol(symbolSet, isLast)

    // 現在
    const currentPrefix =
      prefix +
      symbol +
      new Array(
        Math.floor(options.spaceSize / (options.treeType === 'ascii' ? 1 : 2))
      )
        .fill(symbolSet.horizontal)
        .reduce((prev, cur) => prev + cur, '')

    const currentLine = `${currentPrefix}${options.spaceBeforeName ? ' ' : ''}${
      dirNode.name
    }`

    // 子
    const spaces = new Array(options.spaceSize)
      .fill(' ')
      .reduce((prev, cur) => {
        return prev + cur
      }, '')
    const childrenLines = reduce(
      dirNode.children,
      options,
      prefix + (isLast ? symbolSet.space : symbolSet.vertical) + spaces,
      hie + 1,
      isLastGroup || isLast
    )

    // 追加
    result +=
      currentLine +
      '\n' +
      childrenLines +
      (options.emptyBeforeUpperHierarche && isLast && !(isLastGroup || hie == 0)
        ? `${symbolSet.vertical}\n`
        : '')
  })

  return result.slice(0, hie === 0 ? -1 : result.length)
}

const convert = (dirTree: DirTree, options?: Options): string => {
  return reduce(dirTree, buildOption(options, defaultOptions), '', 0, false)
}

export { convert }
