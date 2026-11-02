import { describe, it, expect } from 'vitest'
import { needsStdin } from './stdinUtils'

describe('needsStdin', () => {
  it('returns true when the code calls input()', () => {
    expect(needsStdin('name = input("ชื่อ: ")')).toBe(true)
    expect(needsStdin('x = input ("ค่า")')).toBe(true)
  })

  it('returns false when the code does not call input()', () => {
    expect(needsStdin('print("สวัสดี")')).toBe(false)
  })

  it('ignores names that only end with input', () => {
    expect(needsStdin('my_input(1)')).toBe(false)
  })
})
