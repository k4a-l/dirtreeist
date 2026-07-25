import {
  defaultOptions,
  treeTypeValues,
  memoAlignValues,
} from '../constants/constant.js'
import { Options, OptionsBase } from '../types'

const optionGuard = (value: any, defaultValue: any, key: keyof OptionsBase) => {
  if (key === 'spaceSize') {
    if (typeof value !== 'number') return defaultValue
    if (value < 1) return defaultValue
    return value
  }

  if (key === 'emptyBeforeUpperHierarchy') {
    if (typeof value !== 'boolean') return defaultValue
    return value
  }

  if (key === 'spaceBeforeName') {
    if (typeof value !== 'boolean') return defaultValue
    return value
  }

  if (key === 'treeType') {
    if (!treeTypeValues.includes(value)) return defaultValue
    return value
  }

  if (key === 'keepMarkdown') {
    if (typeof value !== 'boolean') return defaultValue
    return value
  }

  if (key === 'delimiter') {
    if (value === false) return false
    if (typeof value !== 'string') return defaultValue
    if (value.length === 0) return defaultValue
    return value
  }

  if (key === 'memoAlign') {
    if (!memoAlignValues.includes(value)) return defaultValue
    return value
  }

  if (key === 'memoGap') {
    if (typeof value !== 'number') return defaultValue
    if (value < 0) return defaultValue
    return Math.floor(value)
  }

  if (key === 'memoMaxColumn') {
    if (value === false) return false
    if (typeof value !== 'number') return defaultValue
    if (value < 1) return defaultValue
    return Math.floor(value)
  }

  if (key === 'cjkFont') {
    if (typeof value !== 'boolean') return defaultValue
    return value
  }

  if (key === 'noteAlignToMemo') {
    if (typeof value !== 'boolean') return defaultValue
    return value
  }

  if (key === 'noteBullet') {
    // 空文字は「記号なし」の指定として有効
    if (typeof value !== 'string') return defaultValue
    return value
  }

  if (key === 'noteIndentSize') {
    if (typeof value !== 'number') return defaultValue
    if (value < 0) return defaultValue
    return Math.floor(value)
  }

  return defaultValue
}

const pickOption = <T>(
  option: Options | undefined,
  defaultOption: OptionsBase,
  key: keyof OptionsBase
): T => {
  if (option === undefined) return defaultOptions[key] as T
  if (option[key] !== undefined) {
    return optionGuard(option[key], defaultOption[key], key) as T
  }
  return defaultOption[key] as T
}

const buildOption = (
  options: Options | undefined,
  defaultOptions: OptionsBase
): OptionsBase => {
  return Object.fromEntries(
    Object.entries(defaultOptions).map(([key, value]) => {
      return [
        key,
        pickOption(options, defaultOptions, key as keyof OptionsBase),
      ]
    })
  ) as OptionsBase
}

export { buildOption }
