/**
 * ตรวจว่าโค้ดเรียก input() หรือไม่ เพื่อแสดงช่อง stdin เฉพาะตอนที่ต้องใช้
 * ใช้ word boundary เพื่อไม่ให้ชื่อฟังก์ชันอย่าง my_input() ถูกนับด้วย
 * @param {string} code
 * @returns {boolean}
 */
export function needsStdin(code) {
  return /\binput\s*\(/.test(code)
}
