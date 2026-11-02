/**
 * เตรียมสภาพแวดล้อมก่อนรันโค้ดของผู้เรียน: โหลด package, เขียนไฟล์ข้อมูล และตั้งค่ากราฟ
 * ทั้งหมดนี้ทำก่อนเริ่มนับเวลา 10 วินาที (ดู docs/DECISIONS.md)
 */
import { config, assetUrl } from '../config.js'
import { th } from '../i18n/th.js'
import { describePackageStatus } from '../features/runner/packageStatus.js'
import {
  getDatasetFsPath,
  getDatasetUrl,
  isSafeDatasetName,
  PYODIDE_DATA_DIR,
} from '../features/runner/datasetFiles.js'

// ที่เก็บฟอนต์ไทยใน Pyodide ก่อนลงทะเบียนกับ matplotlib
export const PLOT_FONT_DIR = '/home/pyodide/fonts'

/**
 * ข้อผิดพลาดตอนเตรียมระบบ ข้อความเป็นภาษาไทยที่บอกผู้เรียนว่าควรทำอะไรต่อ
 */
export class PrepareError extends Error {}

// เก็บเนื้อหาไฟล์ข้อมูลไว้ใน worker เพื่อไม่ต้องดาวน์โหลดซ้ำทุกครั้งที่รัน
const datasetCache = new Map()

// ตั้งค่า matplotlib แค่ครั้งเดียวต่อ worker เพราะการ import pyplot และอ่านฟอนต์ใช้เวลานาน
let plottingReady = false

/**
 * เตรียมสภาพแวดล้อมให้โค้ดที่กำลังจะรัน
 * @param {any} py - instance ของ Pyodide
 * @param {object} options
 * @param {string} options.code - โค้ดของผู้เรียน (ใช้หา import ที่ต้องโหลด package)
 * @param {string[]} [options.packages] - package เพิ่มเติมจาก frontmatter ของบท
 * @param {string[]} [options.datasets] - ชื่อไฟล์ CSV ใน public/datasets/
 * @param {(message: string) => void} options.onProgress - ส่งข้อความสถานะภาษาไทยไปแสดงให้ผู้เรียน
 * @returns {Promise<void>}
 * @throws {PrepareError} เมื่อเตรียมไม่สำเร็จ
 */
export async function prepareEnvironment(py, { code, packages = [], datasets = [], onProgress }) {
  const onPackageMessage = (message) => onProgress(describePackageStatus(message))

  try {
    await py.loadPackagesFromImports(code, { messageCallback: onPackageMessage })
    if (packages.length > 0) {
      await py.loadPackage(packages, { messageCallback: onPackageMessage })
    }
  } catch (err) {
    throw new PrepareError(th.runner.prepare.packageFailed(err.message || String(err)))
  }

  if (datasets.length > 0) {
    py.FS.mkdirTree(PYODIDE_DATA_DIR)
    for (const name of datasets) {
      await writeDataset(py, name)
    }
  }

  if (!plottingReady && py.globals.get('_is_installed')('matplotlib')) {
    await setupPlotting(py)
  }

  try {
    // pandas ใช้เวลา import นาน ทำตอนนี้เพื่อไม่ให้ถูกนับในเวลาของโค้ดผู้เรียน
    py.globals.get('_prewarm')(['pandas'])
  } catch (err) {
    throw new PrepareError(th.runner.prepare.packageFailed(err.message || String(err)))
  }
}

/**
 * ดาวน์โหลดไฟล์ CSV แล้วเขียนลงโฟลเดอร์ data/ ของ Pyodide ทุกครั้งที่รัน
 * เขียนใหม่ทุกครั้งเพื่อให้ไฟล์กลับเป็นค่าเดิม แม้ผู้เรียนจะแก้ไขไฟล์ในรอบก่อนหน้า
 * @param {any} py
 * @param {string} name
 */
async function writeDataset(py, name) {
  if (!isSafeDatasetName(name)) {
    throw new PrepareError(th.runner.prepare.datasetMissing(String(name)))
  }

  let text = datasetCache.get(name)
  if (text === undefined) {
    try {
      const response = await fetch(getDatasetUrl(name))
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      text = await response.text()
    } catch {
      throw new PrepareError(th.runner.prepare.datasetMissing(name))
    }
    datasetCache.set(name, text)
  }

  py.FS.writeFile(getDatasetFsPath(name), text, { encoding: 'utf8' })
}

/**
 * โหลดฟอนต์ไทยเข้า Pyodide แล้วตั้งค่า matplotlib ให้ใช้ Agg และฟอนต์นี้
 * @param {any} py
 */
async function setupPlotting(py) {
  try {
    py.FS.mkdirTree(PLOT_FONT_DIR)
    const fontPaths = []
    for (const file of config.fontFiles) {
      const response = await fetch(assetUrl(`fonts/${file}`))
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const path = `${PLOT_FONT_DIR}/${file}`
      py.FS.writeFile(path, new Uint8Array(await response.arrayBuffer()))
      fontPaths.push(path)
    }
    py.globals.get('_setup_plotting')(JSON.stringify(fontPaths))
  } catch {
    throw new PrepareError(th.runner.prepare.fontFailed)
  }
  plottingReady = true
}
