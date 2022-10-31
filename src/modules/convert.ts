import { symbolSets, defaultOptions } from '../constants/constant.js'
import { DirTree, Options, OptionsBase, SymbolSet } from '../types/index'
import { buildOption } from './options.js'

const makeSymbol = (symbolSet: SymbolSet, isLast: boolean): string => {
  if (isLast) return symbolSet.end
  return symbolSet.crossing
}

const makeAsciiSpace = (spaceSize: number) => {
  return new Array(spaceSize).fill(' ').reduce((prev, cur) => {
    return prev + cur
  }, '')
}

const makeSpace = (spaceSize: number) => {
  return (
    new Array(Math.floor(spaceSize / 2)).fill('　').reduce((prev, cur) => {
      return prev + cur
    }, '') + (spaceSize % 2 == 1 ? ' ' : '')
  )
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
    const isOneTop = hie === 0 && dirTree.length === 1
    const symbolSet = symbolSets[options.treeType]

    // 現在
    const makePrefix = () => {
      if (isOneTop) return ''
      return (
        makeSymbol(symbolSet, isLast) +
        new Array(
          Math.floor(options.spaceSize / (options.treeType === 'ascii' ? 1 : 2))
        )
          .fill(symbolSet.horizontal)
          .reduce((prev, cur) => prev + cur, '')
      )
    }

    const currentLine = `${prefix + makePrefix()}${
      options.spaceBeforeName ? ' ' : ''
    }${dirNode.name}`

    // 子
    const makeNextSpaces = () => {
      if (isOneTop) return ''
      return options.treeType === 'ascii'
        ? makeAsciiSpace(options.spaceSize)
        : makeSpace(options.spaceSize)
    }

    const makeNextVertical = () => {
      if (!isLast) return symbolSet.vertical
      if (!isOneTop) return symbolSet.space
      return ''
    }

    const childrenLines = reduce(
      dirNode.children,
      options,
      prefix + makeNextVertical() + makeNextSpaces(),
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
  try {
    return reduce(dirTree, buildOption(options, defaultOptions), '', 0, false)
  } catch (error) {
    return (
      'Some errors occurred!\n\n' +
      String(error) +
      '\n\n' +
      'Please contact to developper.'
    )
  }
}

export { convert }
