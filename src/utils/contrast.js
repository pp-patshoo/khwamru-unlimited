/**
 * Contrast and Luminance calculation utilities according to WCAG 2.1 specifications.
 */

/**
 * Convert a 3-digit or 6-digit hex color code to RGB object.
 * @param {string} hex - e.g. '#FFFFFF' or '#FFF' or 'FFFFFF'
 * @returns {{r: number, g: number, b: number}}
 */
export function hexToRgb(hex) {
  const cleaned = hex.replace(/^#/, '').trim()
  const validHexRegex = /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/
  if (!validHexRegex.test(cleaned)) {
    throw new Error(`Invalid hex color: ${hex}`)
  }

  let fullHex = cleaned
  if (cleaned.length === 3) {
    fullHex = cleaned
      .split('')
      .map((c) => c + c)
      .join('')
  }

  const num = parseInt(fullHex, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

/**
 * Calculate the relative luminance of an sRGB color.
 * According to WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 * @param {number} r - 0-255
 * @param {number} g - 0-255
 * @param {number} b - 0-255
 * @returns {number} Relative luminance (0 to 1)
 */
export function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate the contrast ratio between two colors.
 * According to WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 * @param {string} foregroundHex
 * @param {string} backgroundHex
 * @returns {number} Contrast ratio rounded to 2 decimal places
 */
export function getContrastRatio(foregroundHex, backgroundHex) {
  const fgRgb = hexToRgb(foregroundHex)
  const bgRgb = hexToRgb(backgroundHex)

  const lumFg = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
  const lumBg = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)

  const lighter = Math.max(lumFg, lumBg)
  const darker = Math.min(lumFg, lumBg)

  const ratio = (lighter + 0.05) / (darker + 0.05)
  return Math.round(ratio * 100) / 100
}

/**
 * Check if the contrast ratio passes WCAG AA criteria (>= 4.5:1 for normal text).
 * @param {number} ratio
 * @returns {boolean}
 */
export function isContrastPassing(ratio) {
  return ratio >= 4.5
}
