/**
 * ตัว limit output ของการรันหนึ่งครั้ง
 * กันไม่ให้โค้ดที่พิมพ์ไม่หยุดทำให้หน้าเว็บค้าง โดยนับต่อ chunk ที่ Pyodide ส่งมา
 * เพราะ Pyodide ส่ง stdout ทีละบรรทัดอยู่แล้ว จึงถือว่า 1 chunk = 1 บรรทัด
 */
import { config } from '../../config.js'

const encoder = new TextEncoder()

/**
 * สร้าง limiter ใหม่สำหรับการรันหนึ่งครั้ง
 * @param {object} [options]
 * @param {number} [options.maxLines] - จำนวนบรรทัดสูงสุด
 * @param {number} [options.maxBytes] - ขนาดรวมสูงสุดเป็นไบต์ (UTF-8)
 * @returns {{ accept: (text: string) => string | null, readonly truncated: boolean }}
 *   accept คืน text ถ้ายังอยู่ในขีดจำกัด หรือ null ถ้าเกินแล้ว
 */
export function createOutputLimiter({
  maxLines = config.outputMaxLines,
  maxBytes = config.outputMaxBytes,
} = {}) {
  let lines = 0
  let bytes = 0
  let truncated = false

  return {
    accept(text) {
      if (truncated) return null

      const size = encoder.encode(text).length
      if (lines + 1 > maxLines || bytes + size > maxBytes) {
        truncated = true
        return null
      }

      lines += 1
      bytes += size
      return text
    },
    get truncated() {
      return truncated
    },
  }
}
