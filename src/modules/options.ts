import { defaultOptions, treeTypeValues } from 'constants/constant.js'
import { Options, OptionsBase } from 'types'

const optionGuard = (value: any, defaultValue: any, key: keyof OptionsBase) => {
  if (key === 'spaceSize') {
    if (typeof value !== 'number') return defaultValue
    if (value < 1) return defaultValue
    return value
  }

  if (key === 'emptyBeforeUpperHierarche') {
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
