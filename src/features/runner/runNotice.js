import { th } from '../../i18n/th.js'

/**
 * เลือกข้อความแจ้งผู้เรียนหลังรันเสร็จ เมื่อโค้ดถูกหยุดหรือ output ถูกตัด
 * คืน null ถ้าการรันจบปกติ
 * @param {{ stopped?: string | null, outputTruncated?: boolean }} res
 * @returns {string | null}
 */
export function getRunNotice(res) {
  if (res.stopped === 'timeout') return th.playground.timeoutStopped
  if (res.stopped === 'user') return th.playground.userStopped
  if (res.outputTruncated) return th.playground.outputTruncated
  return null
}
