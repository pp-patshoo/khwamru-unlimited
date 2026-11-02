/**
 * Application Configuration
 */
export const PYODIDE_VERSION = '314.0.7'
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`
export const PYODIDE_MJS_URL = `${PYODIDE_INDEX_URL}pyodide.mjs`
export const PYODIDE_JS_URL = `${PYODIDE_INDEX_URL}pyodide.js`

/**
 * URL ของไฟล์ในโฟลเดอร์ public/ โดยต่อกับ base ของเว็บ (เช่น /khwamru-unlimited/ บน GitHub Pages)
 * @param {string} path - path ที่ไม่มี / นำหน้า เช่น 'datasets/_test.csv'
 * @returns {string}
 */
export function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`
}

export const config = {
  pyodideVersion: PYODIDE_VERSION,
  pyodideIndexUrl: PYODIDE_INDEX_URL,
  pyodideMjsUrl: PYODIDE_MJS_URL,
  pyodideJsUrl: PYODIDE_JS_URL,
  // ขีดจำกัดการรันโค้ด (SPEC หัวข้อ 6)
  runTimeoutMs: 10_000, // หยุดโค้ดอัตโนมัติหลัง 10 วินาที (ไม่นับเวลาโหลด)
  outputMaxLines: 10_000,
  outputMaxBytes: 1_000_000, // 1 MB
  // ฟอนต์ไทยสำหรับกราฟ อยู่ที่ public/fonts/ (license OFL ดูที่ IBMPlexSansThai-OFL.txt)
  fontFiles: ['IBMPlexSansThai-Regular.ttf', 'IBMPlexSansThai-Bold.ttf'],
  tableMaxRows: 50, // DataFrame แสดงสูงสุดกี่แถว (SPEC หัวข้อ 6)
  feedbackUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_feedback_placeholder/viewform',
}

export default config
