type DirNode = {
  name: string
  children: DirNode[]
}

type DirTree = DirNode[]

type OptionsBase = {
  treeType: 'normal' | 'bold' | 'ascii'
  emptyBeforeUpperHierarche: boolean
  spaceBeforeName: boolean
  spaceSize: number
}

type SymbolSet = {
  vertical: string
  horizontal: string
  crossing: string
  end: string
  space: string
}

type Options = Partial<OptionsBase>

export { DirNode, DirTree, Options, OptionsBase, SymbolSet }
