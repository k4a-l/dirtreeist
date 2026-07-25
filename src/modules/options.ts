import { memoAlignValues, treeTypeValues } from "../constants/constant.js";
import type { Options, OptionsBase } from "../types";

/** 検証を通らなかったら既定値に落とす。valueは利用者から来る未検証の値。 */
type Guard<K extends keyof OptionsBase> = (
	value: unknown,
	defaultValue: OptionsBase[K],
) => OptionsBase[K];

/** 値がTであるOptionsBaseのキー。検証を型ごとに使い回すためのもの。 */
type KeysOfType<T> = {
	[K in keyof OptionsBase]: OptionsBase[K] extends T ? K : never;
}[keyof OptionsBase];

/** 整数として扱える数値か。min未満は既定値に落とす。 */
const integerAtLeast =
	<K extends KeysOfType<number>>(min: number): Guard<K> =>
	(value, defaultValue) => {
		if (typeof value !== "number") return defaultValue;
		if (!Number.isFinite(value)) return defaultValue;
		if (value < min) return defaultValue;
		return Math.floor(value) as OptionsBase[K];
	};

const oneOf =
	<K extends keyof OptionsBase>(values: readonly OptionsBase[K][]): Guard<K> =>
	(value, defaultValue) => {
		return values.includes(value as OptionsBase[K])
			? (value as OptionsBase[K])
			: defaultValue;
	};

const boolean =
	<K extends KeysOfType<boolean>>(): Guard<K> =>
	(value, defaultValue) => {
		return typeof value === "boolean"
			? (value as OptionsBase[K])
			: defaultValue;
	};

/** 空文字は「記号なし」の指定として有効なので許す。 */
const anyString: Guard<"noteBullet"> = (value, defaultValue) => {
	return typeof value === "string" ? value : defaultValue;
};

/** 空文字だと区切れないので落とす。falseは機能オフの指定として有効。 */
const nonEmptyStringOrFalse: Guard<"delimiter"> = (value, defaultValue) => {
	if (value === false) return false;
	if (typeof value !== "string") return defaultValue;
	if (value.length === 0) return defaultValue;
	return value;
};

const positiveIntegerOrFalse: Guard<"memoMaxColumn"> = (
	value,
	defaultValue,
) => {
	if (value === false) return false;
	if (typeof value !== "number") return defaultValue;
	if (!Number.isFinite(value)) return defaultValue;
	if (value < 1) return defaultValue;
	return Math.floor(value);
};

/** キーごとの検証。全キーを網羅していないと型エラーになる。 */
const guards: { [K in keyof OptionsBase]: Guard<K> } = {
	treeType: oneOf(treeTypeValues),
	emptyBeforeUpperHierarchy: boolean(),
	spaceBeforeName: boolean(),
	spaceSize: integerAtLeast(1),
	keepMarkdown: boolean(),
	cjkFont: boolean(),
	delimiter: nonEmptyStringOrFalse,
	memoAlign: oneOf(memoAlignValues),
	memoGap: integerAtLeast(0),
	memoMaxColumn: positiveIntegerOrFalse,
	noteAlignToMemo: boolean(),
	noteBullet: anyString,
	noteIndentSize: integerAtLeast(0),
};

const pickOption = <K extends keyof OptionsBase>(
	options: Options | undefined,
	defaultOptions: OptionsBase,
	key: K,
): OptionsBase[K] => {
	const defaultValue = defaultOptions[key];
	const value = options?.[key];
	if (value === undefined) return defaultValue;
	return guards[key](value, defaultValue);
};

const buildOption = (
	options: Options | undefined,
	defaultOptions: OptionsBase,
): OptionsBase => {
	const keys = Object.keys(guards) as (keyof OptionsBase)[];

	return keys.reduce((built, key) => {
		return Object.assign(built, {
			[key]: pickOption(options, defaultOptions, key),
		});
	}, {} as OptionsBase);
};

export { buildOption };
