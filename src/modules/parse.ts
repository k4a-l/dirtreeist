import {
  DirNode,
  DirTree,
  NoteNode,
  Options,
  ParseOptions,
} from '../types/index'

import { fromMarkdown } from 'mdast-util-from-markdown'

import { Content, ListItem, List } from 'mdast'
import { buildOption } from './options'
import { defaultOptions } from '../constants/constant'

type Range = { from: number; to: number }

const wholeRange: Range = { from: 0, to: Infinity }

const unescapeMarkdown = (text: string): string => {
  return text.replace(/\\([!-/:-@[-`{-~])/g, '$1')
}

const extractText = (
  content: Content,
  chunk: string,
  options: ParseOptions,
  range: Range = wholeRange
): string => {
  if (!content) return ''

  const start = content.position?.start.offset ?? 0
  const end = content.position?.end.offset ?? Infinity
  if (end <= range.from || start >= range.to) return ''

  const isWhole = start >= range.from && end <= range.to
  const sliceStart = Math.max(start, range.from)
  const sliceEnd = Math.min(end, range.to)

  if (options.keepMarkdown && content.position) {
    return chunk.slice(sliceStart, sliceEnd)
  }

  if (content.type === 'text') {
    if (isWhole) return content.value
    return unescapeMarkdown(chunk.slice(sliceStart, sliceEnd))
  }

  // inlineCodeなどchildrenを持たずvalueだけを持つもの
  if ('value' in content) {
    if (isWhole) return content.value
    return chunk.slice(sliceStart, sliceEnd)
  }

  if ('children' in content) {
    return content.children
      .map((child) => {
        return extractText(child, chunk, options, range)
      })
      .reduce((prev, cur) => {
        return prev + cur
      }, '')
  }

  return ''
}

/**
 * メモの区切り文字の位置(chunk上のoffset)を返す。
 * リンクのURLやコードスパンの中身を誤って区切らないよう、
 * テキストノードの範囲だけを走査する。`\#`のようなエスケープは無視する。
 */
const findMemoOffset = (
  content: Content,
  chunk: string,
  delimiter: string
): number | undefined => {
  if (!content) return undefined
  if (!('children' in content)) return undefined

  for (const child of content.children) {
    if (child.type !== 'text') continue

    const start = child.position?.start.offset
    const end = child.position?.end.offset
    if (start === undefined || end === undefined) continue

    let index = chunk.indexOf(delimiter, start)
    while (index >= 0 && index + delimiter.length <= end) {
      if (chunk[index - 1] !== '\\') return index
      index = chunk.indexOf(delimiter, index + delimiter.length)
    }
  }

  return undefined
}

/** 名前が空でメモだけの行(note)かどうか。 */
const isNoteOnly = (node: DirNode): boolean => {
  return node.name === '' && node.memo !== undefined
}

/**
 * noteの行を、子孫まとめてNoteNodeに変換する。
 * noteの子は名前を持っていてもnoteとして扱う。
 */
const toNoteNode = (node: DirNode): NoteNode => {
  return {
    text: node.memo ?? node.name,
    children: node.children.map(toNoteNode),
  }
}

/**
 * noteの子をchildrenから外してnotesへ移す。
 * 分割前のchildrenを見るので、実ノードと混ざっていても元の順序を保てる。
 */
const splitNotes = (node: DirNode): DirNode => {
  const notes = node.children.filter(isNoteOnly).map(toNoteNode)
  const children = node.children
    .filter((child) => !isNoteOnly(child))
    .map(splitNotes)

  if (notes.length === 0) return { ...node, children }

  return { ...node, children, notes }
}

const extractListItem = (
  listItem: ListItem,
  chunk: string,
  options: ParseOptions
): DirNode => {
  const content = listItem.children[0]

  const children =
    listItem.children.length > 1
      ? extractList(listItem.children[1] as List, chunk, options)
      : []

  const delimiter = options.delimiter
  const memoOffset = delimiter
    ? findMemoOffset(content, chunk, delimiter)
    : undefined

  if (!delimiter || memoOffset === undefined) {
    return { name: extractText(content, chunk, options), children }
  }

  const name = extractText(content, chunk, options, {
    from: 0,
    to: memoOffset,
  }).trimEnd()

  const memo = extractText(content, chunk, options, {
    from: memoOffset + delimiter.length,
    to: Infinity,
  }).trim()

  if (!memo) return { name, children }

  return { name, memo, children }
}

const extractList = (
  list: Content,
  chunk: string,
  options: ParseOptions
): DirTree => {
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
      return extractList(list, chunk, mergedOptions).map(splitNotes)
    } catch (error) {
      return []
    }
  })

  return result
}

export { parse }
