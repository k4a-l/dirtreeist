import type { memoAlignValues, treeTypeValues } from "../constants/constant";

/**
 * 名前を持たずメモだけの行(`- -- xxx`)。
 * 名前の右に書くmemoと区別してnoteと呼ぶ。アウトライン形式で階層を持てる。
 */
type NoteNode = {
	text: string;
	children: NoteNode[];
};

type DirNode = {
	name: string;
	/** 名前と同じ行に書かれたメモ */
	memo?: string;
	/** 子として書かれた、名前を持たないメモ */
	notes?: NoteNode[];
	children: DirNode[];
};

type DirTree = DirNode[];

type ParseOptions = {
	keepMarkdown: boolean;
	/** 名前とmemo/noteを割る文字。memoとnoteの両方に効くので接頭辞を付けない */
	delimiter: string | false;
};

type ConvertOptions = {
	treeType: (typeof treeTypeValues)[number];
	emptyBeforeUpperHierarchy: boolean;
	spaceBeforeName: boolean;
	spaceSize: number;
	/**
	 * CJKフォントで表示する前提かどうか。
	 * 罫線や丸数字は環境によって半角・全角どちらにも描画されるため、
	 * メモを揃える幅の計算をどちらに寄せるかの判断に使う。
	 */
	cjkFont: boolean;
	// 名前がmarkdown記法を含みうるかの判断に使うので、揃えの計算にも必要
	keepMarkdown: boolean;

	/** memo(行内)をどの範囲で揃えるか */
	memoAlign: (typeof memoAlignValues)[number];
	/** 名前とmemoの間の最小間隔(半角スペース換算) */
	memoGap: number;
	/**
	 * memo列の上限桁数。falseなら無制限。
	 * 極端に長い名前1つに全行が引きずられるのを防ぐためのもので、
	 * 上限を超える名前の行だけがmemoGapぶんだけ空けて置かれ、揃いから外れる。
	 */
	memoMaxColumn: number | false;

	/** noteをmemo列に揃えるか。falseなら罫線の直後に置く */
	noteAlignToMemo: boolean;
	/** noteの行頭に付ける記号。空文字なら付けない */
	noteBullet: string;
	/** noteの階層1つあたりのインデント幅(半角スペース換算) */
	noteIndentSize: number;
};

/**
 * 出力1行分。階層構造を上から下へのフラットな行列に落としたもの。
 * 空白は揃え済みの文字列で持つので、連結すればそのまま出力になる。
 * 利用側で独自にレンダリングするときは、この単位でスタイルを当てられる。
 */
type NodeLine = {
	type: "node";
	/** 罫線部分。`│　├─` など */
	branch: string;
	name: string;
	/** 名前とメモの間の空白。メモがなければ空文字 */
	gap: string;
	/** 名前と同じ行に書かれたメモ */
	memo?: string;
	/** この行のもとになったDirNode */
	node: DirNode;
	/** 階層の深さ。0が最上位 */
	hierarchy: number;
};

type NoteLine = {
	type: "note";
	/** 罫線部分。親の位置を引き継いだもの */
	branch: string;
	/** 罫線からnote本文までの空白 */
	gap: string;
	/** note内階層のインデント */
	indent: string;
	/** 行頭の記号 */
	bullet: string;
	text: string;
	/** note内の階層。0が最上位 */
	depth: number;
	/** このnoteが属するDirNode */
	node: DirNode;
	/** この行のもとになったNoteNode */
	noteNode: NoteNode;
};

/** 罫線だけの空行(emptyBeforeUpperHierarchy)。 */
type EmptyLine = {
	type: "empty";
	branch: string;
};

type Line = NodeLine | NoteLine | EmptyLine;

type OptionsBase = ParseOptions & ConvertOptions;

type SymbolSet = {
	vertical: string;
	horizontal: string;
	crossing: string;
	end: string;
	space: string;
};

type Options = Partial<OptionsBase>;

export type {
	ConvertOptions,
	DirNode,
	DirTree,
	EmptyLine,
	Line,
	NodeLine,
	NoteLine,
	NoteNode,
	Options,
	OptionsBase,
	ParseOptions,
	SymbolSet,
};
