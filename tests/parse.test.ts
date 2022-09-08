import { parse } from '../src/modules/parse'

describe('convert', () => {
  test('success', () => {
    expect(parse('')).toStrictEqual([])
  })
})
