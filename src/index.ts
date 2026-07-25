import {
	defaultOptions,
	memoAlignValues,
	symbolSets,
	treeTypeValues,
} from "./constants/constant.js";
import { convert, layout, lineToString } from "./modules/convert.js";
import { parse } from "./modules/parse.js";
import type {
	DirNode,
	DirTree,
	EmptyLine,
	Line,
	NodeLine,
	NoteLine,
	NoteNode,
	Options,
} from "./types/index";

const dirtreeist = (markdown: string, option?: Options) => {
	return parse(markdown, option).map((dirtree) => convert(dirtree, option));
};

export {
	convert,
	defaultOptions,
	layout,
	lineToString,
	memoAlignValues,
	parse,
	symbolSets,
	treeTypeValues,
};
export default dirtreeist;
export type {
	DirNode,
	DirTree,
	EmptyLine,
	Line,
	NodeLine,
	NoteLine,
	NoteNode,
	Options,
};
