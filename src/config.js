/**
 * Application Configuration
 */
export const PYODIDE_VERSION = '314.0.7'
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`
export const PYODIDE_MJS_URL = `${PYODIDE_INDEX_URL}pyodide.mjs`
export const PYODIDE_JS_URL = `${PYODIDE_INDEX_URL}pyodide.js`

export const config = {
  pyodideVersion: PYODIDE_VERSION,
  pyodideIndexUrl: PYODIDE_INDEX_URL,
  pyodideMjsUrl: PYODIDE_MJS_URL,
  pyodideJsUrl: PYODIDE_JS_URL,
  // ขีดจำกัดการรันโค้ด (SPEC หัวข้อ 6)
  runTimeoutMs: 10_000, // หยุดโค้ดอัตโนมัติหลัง 10 วินาที (ไม่นับเวลาโหลด)
  outputMaxLines: 10_000,
  outputMaxBytes: 1_000_000, // 1 MB
  feedbackUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_feedback_placeholder/viewform',
}

export default config
