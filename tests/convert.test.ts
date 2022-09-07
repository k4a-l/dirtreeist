import { convert } from '../src/modules/convert'

describe('convert', () => {
  test('success', () => {
    expect(convert([])).toBe('')
  })
})
