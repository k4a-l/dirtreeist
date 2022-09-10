import { treeTypeValues } from "constants/constant.js"

type DirNode = {
  name: string
  children: DirNode[]
}

type DirTree = DirNode[]

type OptionsBase = {
  treeType: typeof treeTypeValues[number]
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

export type { DirNode, DirTree, Options, OptionsBase, SymbolSet }
