import { defaultOptions } from 'constants/constant.js'
import { Options, OptionsBase } from 'types'

const pickOption = <T>(
  option: Options | undefined,
  defaultOption: OptionsBase,
  key: keyof OptionsBase
): T => {
  if (option === undefined) return defaultOptions[key] as T
  if (option[key] !== undefined) return option[key] as T
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
