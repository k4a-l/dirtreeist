import { DirTree, Options, OptionsBase } from 'types/index'

type SymbolSet = {
  vertical: string
  horizontal: string
  crossing: string
  end: string
  space: string
}

const symbolSets: {
  [key in OptionsBase['treeType']]: SymbolSet
} = {
  normal: {
    vertical: '│',
    horizontal: '─',
    crossing: '├',
    end: '└',
    space: '  ',
  },
  bold: {
    vertical: '┃',
    horizontal: '━',
    crossing: '┣',
    end: '┗',
    space: '  ',
  },
  ascii: {
    vertical: '|',
    horizontal: '-',
    crossing: '+',
    end: '+',
    space: ' ',
  },
}

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
      new Array(options.spaceSize / 2)
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
  const defaultOptions: OptionsBase = {
    treeType: options?.treeType ?? 'normal',
    spaceBeforeName: options?.spaceBeforeName ?? false,
    spaceSize: options?.spaceSize ?? 2,
    emptyBeforeUpperHierarche: options?.emptyBeforeUpperHierarche ?? false,
  }

  return reduce(dirTree, defaultOptions, '', 0, false)
}

export { convert }
