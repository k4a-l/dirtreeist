import { DirTree } from 'types/index'

import { fromMarkdown } from 'mdast-util-from-markdown'

const parse = async (chunk: string): Promise<DirTree[]> => {
  const tree = fromMarkdown(chunk)
  console.log(tree)
  return []
}

export { parse }
