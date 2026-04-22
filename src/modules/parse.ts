import { DirNode, DirTree, Options, ParseOptions } from '../types/index'

import { fromMarkdown } from 'mdast-util-from-markdown'

import { Content, ListItem, List } from 'mdast'
import { buildOption } from './options'
import { defaultOptions } from '../constants/constant'

const extractText = (content: Content, chunk: string, options: ParseOptions): string => {
  if (!content) return ''

  if (options.keepMarkdown && content.position) {
    return chunk.slice(content.position.start.offset, content.position.end.offset)
  }

  if (content.type === 'text') return content.value

  if ('children' in content) {
    return content.children
      .map((child) => {
        return extractText(child, chunk, options)
      })
      .reduce((prev, cur) => {
        return prev + cur
      }, '')
  }

  return ''
}

const extractListItem = (listItem: ListItem, chunk: string, options: ParseOptions): DirNode => {
  const name = extractText(listItem.children[0], chunk, options)

  const children =
    listItem.children.length > 1
      ? extractList(listItem.children[1] as List, chunk, options)
      : []

  return { name, children: children }
}

const extractList = (list: Content, chunk: string, options: ParseOptions): DirTree => {
  if (list.type !== 'list') return []
  if (!list.children) return []
  return list.children.map((listItem) => {
    return extractListItem(listItem, chunk, options)
  })
}

const parse = (chunk: string, options?: Options): DirTree[] => {
  const tree = fromMarkdown(chunk)
  const mergedOptions = buildOption(options, defaultOptions)

  const lists = tree.children.filter((child) => child.type === 'list')

  const result = lists.map((list) => {
    try {
      return extractList(list, chunk, mergedOptions)
    } catch (error) {
      return []
    }
  })

  return result
}

export { parse }
