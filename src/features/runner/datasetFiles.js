import { assetUrl } from '../../config.js'

// โฟลเดอร์ใน Pyodide ที่ผู้เรียนเรียกด้วย pd.read_csv("data/ชื่อไฟล์.csv") (SPEC หัวข้อ 6)
export const PYODIDE_DATA_DIR = '/home/pyodide/data'

// อนุญาตเฉพาะชื่อไฟล์ที่มีตัวอักษรปลอดภัย ไม่มี / หรือ .. เพื่อไม่ให้ออกนอกโฟลเดอร์ข้อมูล
const SAFE_DATASET_NAME = /^[A-Za-z0-9_-]+\.csv$/

/**
 * ตรวจว่าชื่อไฟล์ข้อมูลปลอดภัยพอจะนำไปใช้เป็น path หรือไม่
 * @param {unknown} name
 * @returns {boolean}
 */
export function isSafeDatasetName(name) {
  return typeof name === 'string' && SAFE_DATASET_NAME.test(name)
}

/**
 * URL ของไฟล์ข้อมูลใน public/datasets/
 * @param {string} name - ชื่อไฟล์ที่ผ่าน isSafeDatasetName แล้ว
 * @returns {string}
 */
export function getDatasetUrl(name) {
  return assetUrl(`datasets/${name}`)
}

/**
 * path ของไฟล์ข้อมูลในระบบไฟล์ของ Pyodide
 * @param {string} name - ชื่อไฟล์ที่ผ่าน isSafeDatasetName แล้ว
 * @returns {string}
 */
export function getDatasetFsPath(name) {
  return `${PYODIDE_DATA_DIR}/${name}`
}
