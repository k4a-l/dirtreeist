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

type Options = Partial<OptionsBase>

export { DirTree, Options, OptionsBase }
