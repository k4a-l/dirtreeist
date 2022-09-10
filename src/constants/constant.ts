import { OptionsBase, SymbolSet } from 'types'

const symbolSets: {
  [key in OptionsBase['treeType']]: SymbolSet
} = {
  normal: {
    vertical: '│',
    horizontal: '─',
    crossing: '├',
    end: '└',
    space: '　',
  },
  bold: {
    vertical: '┃',
    horizontal: '━',
    crossing: '┣',
    end: '┗',
    space: '　',
  },
  ascii: {
    vertical: '|',
    horizontal: '-',
    crossing: '+',
    end: '+',
    space: ' ',
  },
}

const defaultOptions: OptionsBase = {
  treeType: 'normal',
  spaceBeforeName: false,
  spaceSize: 2,
  emptyBeforeUpperHierarche: false,
}

export { symbolSets, defaultOptions }
