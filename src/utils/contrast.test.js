import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  getLuminance,
  getContrastRatio,
  isContrastPassing,
} from './contrast'
import { CONTRAST_PAIRS } from './contrastPairs'

describe('contrast utility', () => {
  it('converts hex strings to RGB correctly', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(hexToRgb('1F3D2B')).toEqual({ r: 31, g: 61, b: 43 })
  })

  it('throws on invalid hex strings', () => {
    expect(() => hexToRgb('xyz')).toThrow('Invalid hex color: xyz')
    expect(() => hexToRgb('#12345')).toThrow('Invalid hex color: #12345')
  })

  it('calculates relative luminance correctly', () => {
    expect(getLuminance(255, 255, 255)).toBeCloseTo(1.0, 2)
    expect(getLuminance(0, 0, 0)).toBeCloseTo(0.0, 2)
  })

  it('calculates contrast ratio between black and white as 21:1', () => {
    const ratio = getContrastRatio('#000000', '#ffffff')
    expect(ratio).toBe(21)
    expect(isContrastPassing(ratio)).toBe(true)
  })

  it('verifies every color pair in CONTRAST_PAIRS passes WCAG AA (>= 4.5:1)', () => {
    CONTRAST_PAIRS.forEach((pair) => {
      const ratio = getContrastRatio(pair.fg, pair.bg)
      expect(
        ratio,
        `Pair "${pair.name}" (${pair.fg} on ${pair.bg}) ratio ${ratio} must be >= 4.5`
      ).toBeGreaterThanOrEqual(4.5)
      expect(isContrastPassing(ratio)).toBe(true)
    })
  })
})
