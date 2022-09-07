type DirNode = {
  name: string
  children: DirNode[]
}

type DirTree = DirNode[]

type Options = {
  treeType?: 1 | 2 | 3
  emptyBeforeUpperHierarche?: boolean
  spaceBeforeName?: boolean
  spaceSize?: number
}

export { DirTree, Options }
