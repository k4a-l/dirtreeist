import { symbolSets, defaultOptions } from '../constants/constant.js'
import {
  DirNode,
  DirTree,
  NoteNode,
  Line,
  Options,
  ConvertOptions,
  SymbolSet,
} from '../types/index'
import { buildOption } from './options.js'
import { stringWidth, stripMarkdown, ambiguousWidthOf } from './width.js'

/**
 * 揃えを計算する前の1行。groupは揃えの単位。
 * これに空白を詰めたものがLineになる。
 *
 * node: 通常のディレクトリ/ファイルの行。
 *   prefixとnameを分けて持つのは、幅を測るときnameからだけmarkdown記法を除くため。
 * note: 名前を持たずメモだけの行。groupは所属するnode行と同じ値を持ち、
 *   noteAlignToMemoのときその列に揃える。
 * empty: 罫線だけの空行。揃えには関与しない。
 */
type Row =
  | {
      kind: 'node'
      prefix: string
      name: string
      memo?: string
      group: number
      node: DirNode
      hierarchy: number
    }
  | {
      kind: 'note'
      prefix: string
      text: string
      depth: number
      group: number
      node: DirNode
      noteNode: NoteNode
    }
  | {
      kind: 'empty'
      prefix: string
    }

const makeSymbol = (symbolSet: SymbolSet, isLast: boolean): string => {
  if (isLast) return symbolSet.end
  return symbolSet.crossing
}

const makeAsciiSpace = (spaceSize: number) => {
  return new Array(spaceSize).fill(' ').reduce((prev, cur) => {
    return prev + cur
  }, '')
}

const makeSpace = (spaceSize: number) => {
  return (
    new Array(Math.floor(spaceSize / 2)).fill('　').reduce((prev, cur) => {
      return prev + cur
    }, '') + (spaceSize % 2 == 1 ? ' ' : '')
  )
}

const reduce = (
  dirTree: DirTree,
  options: ConvertOptions,
  prefix: string,
  hie: number,
  isLastGroup: boolean,
  group: number,
  counter: { value: number }
): Row[] => {
  const rows: Row[] = []

  // siblingsでは子要素を挟んだ時点で揃えを打ち切るため、兄弟の途中で切り替わりうる
  let currentGroup = group

  dirTree.forEach((dirNode, dirNodeIndex) => {
    // 準備
    const isLast = dirNodeIndex == dirTree.length - 1
    const isOneTop = hie === 0 && dirTree.length === 1
    const symbolSet = symbolSets[options.treeType]

    // 現在
    const makePrefix = () => {
      if (isOneTop) return ''
      return (
        makeSymbol(symbolSet, isLast) +
        new Array(
          Math.floor(options.spaceSize / (options.treeType === 'ascii' ? 1 : 2))
        )
          .fill(symbolSet.horizontal)
          .reduce((prev, cur) => prev + cur, '') +
        (options.spaceBeforeName ? ' ' : '')
      )
    }

    rows.push({
      kind: 'node',
      prefix: prefix + makePrefix(),
      name: dirNode.name,
      memo: dirNode.memo,
      group: currentGroup,
      node: dirNode,
      hierarchy: hie,
    })

    // 子
    const makeNextSpaces = () => {
      if (isOneTop) return ''
      return options.treeType === 'ascii'
        ? makeAsciiSpace(options.spaceSize)
        : makeSpace(options.spaceSize)
    }

    const makeNextVertical = () => {
      if (!isLast) return symbolSet.vertical
      if (!isOneTop) return symbolSet.space
      return ''
    }

    const childPrefix = prefix + makeNextVertical() + makeNextSpaces()

    /**
     * note行の罫線。
     * noteの下には子要素が続くので、childPrefixの後ろにさらに縦線を置いて
     * 自分から子への線を途切れさせない。子がなければ線を引く先がないので置かない。
     */
    const notePrefix =
      dirNode.children.length > 0
        ? childPrefix + symbolSet.vertical
        : childPrefix

    // noteは自身の行の直後、子要素より前に出す
    const pushNotes = (notes: NoteNode[], depth: number) => {
      notes.forEach((noteNode) => {
        rows.push({
          kind: 'note',
          prefix: notePrefix,
          text: noteNode.text,
          depth,
          group: currentGroup,
          node: dirNode,
          noteNode,
        })
        pushNotes(noteNode.children, depth + 1)
      })
    }

    pushNotes(dirNode.notes ?? [], 0)

    counter.value += 1

    const childrenRows = reduce(
      dirNode.children,
      options,
      childPrefix,
      hie + 1,
      isLastGroup || isLast,
      counter.value,
      counter
    )

    rows.push(...childrenRows)

    // 子要素が挟まると見た目の連続性が切れるので、次の兄弟から別グループにする
    if (options.memoAlign === 'siblings' && childrenRows.length > 0) {
      counter.value += 1
      currentGroup = counter.value
    }

    // 追加
    if (
      options.emptyBeforeUpperHierarchy &&
      isLast &&
      !(isLastGroup || hie == 0)
    ) {
      rows.push({ kind: 'empty', prefix: symbolSet.vertical })
    }
  })

  return rows
}

/** memo/noteの開始位置を揃えて、行ごとに空白を確定させる。 */
const align = (rows: Row[], options: ConvertOptions): Line[] => {
  const keyOf = (row: Extract<Row, { group: number }>) =>
    options.memoAlign === 'all' ? 0 : row.group

  const ambiguousWidth = ambiguousWidthOf(options.cjkFont)
  const widthOf = (text: string) => stringWidth(text, ambiguousWidth)

  // keepMarkdownのときは記法がレンダリングで消える分を幅から差し引く
  const nodeWidthOf = (row: Extract<Row, { kind: 'node' }>) =>
    widthOf(row.prefix) +
    widthOf(options.keepMarkdown ? stripMarkdown(row.name) : row.name)

  // note内の階層はインデントで表す
  const makeNoteIndent = (depth: number) => {
    const size = options.noteIndentSize * depth
    return options.treeType === 'ascii'
      ? makeAsciiSpace(size)
      : makeSpace(size)
  }

  const columns = new Map<number, number>()

  if (options.memoAlign !== 'none') {
    const maxColumn = options.memoMaxColumn

    rows.forEach((row) => {
      if (row.kind !== 'node' || row.memo === undefined) return

      const width = nodeWidthOf(row)

      // 上限を超える行は列の決定に加わらせない。
      // 1つの長い名前に他の行すべてが引きずられるのを防ぐため。
      if (maxColumn !== false && width > maxColumn) return

      const key = keyOf(row)
      columns.set(key, Math.max(columns.get(key) ?? 0, width))
    })
  }

  return rows.map((row): Line => {
    if (row.kind === 'empty') {
      return { type: 'empty', branch: row.prefix }
    }

    if (row.kind === 'note') {
      const common = {
        type: 'note' as const,
        branch: row.prefix,
        indent: makeNoteIndent(row.depth),
        bullet: options.noteBullet,
        text: row.text,
        depth: row.depth,
        node: row.node,
        noteNode: row.noteNode,
      }

      // 揃えないときは名前の位置に依存せず、罫線の直後に置く
      if (!options.noteAlignToMemo) {
        return { ...common, gap: makeNoteIndent(1) }
      }

      // 所属するnode行のmemo列に揃える
      const width = widthOf(row.prefix)
      const column = columns.get(keyOf(row)) ?? width
      return {
        ...common,
        gap: makeAsciiSpace(Math.max(column - width, 0) + options.memoGap),
      }
    }

    const common = {
      type: 'node' as const,
      branch: row.prefix,
      name: row.name,
      node: row.node,
      hierarchy: row.hierarchy,
    }

    if (row.memo === undefined) return { ...common, gap: '' }

    const width = nodeWidthOf(row)
    const column = columns.get(keyOf(row)) ?? width
    return {
      ...common,
      gap: makeAsciiSpace(Math.max(column - width, 0) + options.memoGap),
      memo: row.memo,
    }
  })
}

/** Lineを1行の文字列にする。 */
const lineToString = (line: Line): string => {
  if (line.type === 'empty') return line.branch
  if (line.type === 'note') {
    return line.branch + line.gap + line.indent + line.bullet + line.text
  }
  return line.branch + line.name + line.gap + (line.memo ?? '')
}

/**
 * 階層構造を、上から下へのフラットな行データに落とす。
 * 罫線・名前・空白・メモが分かれているので、利用側で独自にレンダリングできる。
 */
const layout = (dirTree: DirTree, options?: Options): Line[] => {
  const mergedOptions = buildOption(options, defaultOptions)
  return align(
    reduce(dirTree, mergedOptions, '', 0, false, 0, { value: 0 }),
    mergedOptions
  )
}

const convert = (dirTree: DirTree, options?: Options): string => {
  try {
    return layout(dirTree, options).map(lineToString).join('\n')
  } catch (error) {
    return (
      'Some errors occurred!\n\n' +
      String(error) +
      '\n\n' +
      'Please contact to developper.'
    )
  }
}

export { convert, layout, lineToString }
