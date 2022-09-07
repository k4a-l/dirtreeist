type DirNode = {
  name: string
  children: DirNode[]
}

type DirTree = DirNode[]

type Options = {
  treeType?: 'normal' | 'bold' | 'ascii'
  emptyBeforeUpperHierarche?: boolean
  spaceBeforeName?: boolean
  spaceSize?: number
}

export { DirTree, Options }
