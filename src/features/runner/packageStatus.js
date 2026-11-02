import { th } from '../../i18n/th'

const LOADING_PATTERN = /^Loading (.+)$/
const LOADED_PATTERN = /^Loaded (.+)$/

/**
 * แปลงข้อความความคืบหน้าของ Pyodide ตอนโหลด package เป็นข้อความภาษาไทย
 * ถ้าอ่านข้อความไม่ได้ จะใช้ข้อความทั่วไปแทน เพื่อไม่ให้หน้าจอแสดงข้อความภาษาอังกฤษที่ผู้เรียนไม่เข้าใจ
 * @param {string} message - ข้อความจาก messageCallback ของ loadPackage เช่น "Loading numpy, pandas"
 * @returns {string}
 */
export function describePackageStatus(message) {
  const text = String(message || '').trim()

  const loading = text.match(LOADING_PATTERN)
  if (loading) return th.runner.prepare.packageLoading(loading[1])

  const loaded = text.match(LOADED_PATTERN)
  if (loaded) return th.runner.prepare.packageLoaded(loaded[1])

  return th.runner.prepare.packageDefault
}
