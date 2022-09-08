import { DirNode, DirTree } from 'types/index'

import { fromMarkdown } from 'mdast-util-from-markdown'

import { Content, ListItem, List } from 'mdast'

const extractText = (content: Content): string => {
  if (content.type === 'text') return content.value

  if ('children' in content) {
    return content.children
      .map((child) => {
        return extractText(child)
      })
      .reduce((prev, cur) => {
        return prev + cur
      }, '')
  }

  return ''
}

const extractListItem = (listItem: ListItem): DirNode => {
  const name = extractText(listItem.children[0])

  const children =
    listItem.children.length > 1
      ? extractList(listItem.children[1] as List)
      : []

  return { name, children: children }
}

const extractList = (list: List): DirTree => {
  return list.children.map((listItem) => {
    return extractListItem(listItem)
  })
}

const parse = (chunk: string): DirTree[] => {
  const tree = fromMarkdown(chunk)

  const lists = tree.children.filter((child) => child.type === 'list') as List[]

  const result = lists.map((list) => {
    return extractList(list)
  })

  return result
}

export { parse }
