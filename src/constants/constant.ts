import { OptionsBase, SymbolSet } from '../types'

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
  emptyBeforeUpperHierarchy: false,
  keepMarkdown: false,
  cjkFont: true,
  delimiter: false, // --
  memoAlign: 'all',
  memoGap: 2,
  memoMaxColumn: false,
  noteAlignToMemo: true,
  noteBullet: '・',
  noteIndentSize: 2,
}

const treeTypeValues = ['normal', 'bold', 'ascii'] as const

const memoAlignValues = ['all', 'siblings', 'none'] as const

export {
  symbolSets,
  defaultOptions,
  treeTypeValues,
  memoAlignValues,
}
