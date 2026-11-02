/**
 * Client for interacting with the Pyodide Web Worker.
 */
import { config } from '../../config.js'
import { th } from '../../i18n/th'
import { createOutputLimiter } from './outputLimiter.js'

let worker = null
let currentStatus = {
  state: 'uninitialized', // 'uninitialized' | 'loading' | 'ready' | 'running' | 'error'
  message: '',
}

const statusListeners = new Set()
const activeRuns = new Map()
let initPromise = null

/**
 * Notify all subscribers of a status change
 * @param {{ state: string, message: string }} newStatus
 */
function updateStatus(newStatus) {
  currentStatus = newStatus
  statusListeners.forEach((listener) => {
    try {
      listener(currentStatus)
    } catch (e) {
      console.error('Error in status listener:', e)
    }
  })
}

/**
 * จบการรันหนึ่งครั้ง และยกเลิก timer ที่ตั้งไว้
 * @param {string} id
 * @param {{ ok: boolean, error?: object | null, stopped?: string | null }} outcome
 */
function finishRun(id, outcome) {
  const run = activeRuns.get(id)
  if (!run) return

  activeRuns.delete(id)
  clearTimeout(run.timer)
  run.resolve({
    ok: outcome.ok,
    error: outcome.error || null,
    result: run.lastResult || null,
    stopped: outcome.stopped || null,
    outputTruncated: run.limiter.truncated,
  })
}

/**
 * เริ่มนับเวลาหยุดอัตโนมัติ เมื่อ worker บอกว่าเริ่มรันโค้ดของผู้เรียนแล้ว
 * จึงไม่นับเวลาที่ใช้โหลด package ก่อนหน้า (SPEC หัวข้อ 6)
 * @param {string} id
 */
function startRunTimer(id) {
  const run = activeRuns.get(id)
  if (!run || run.timer) return
  run.timer = setTimeout(() => restartRunner('timeout'), run.timeoutMs)
}

/**
 * Handle incoming messages from the Pyodide worker
 * @param {MessageEvent} event
 */
function handleWorkerMessage(event) {
  const data = event.data
  if (!data || !data.type) return

  switch (data.type) {
    case 'status':
      updateStatus({
        state: data.state,
        message: data.message || '',
      })
      if (data.state === 'running' && data.id) {
        startRunTimer(data.id)
      }
      break

    case 'stdout': {
      const run = activeRuns.get(data.id)
      if (run && typeof run.onStdout === 'function') {
        const text = run.limiter.accept(data.text)
        if (text !== null) run.onStdout(text)
      }
      break
    }

    case 'stderr': {
      const run = activeRuns.get(data.id)
      if (run && typeof run.onStderr === 'function') {
        const text = run.limiter.accept(data.text)
        if (text !== null) run.onStderr(text)
      }
      break
    }

    case 'image': {
      const run = activeRuns.get(data.id)
      if (run && typeof run.onImage === 'function') {
        run.onImage(data.dataUrl)
      }
      break
    }

    case 'table': {
      const run = activeRuns.get(data.id)
      if (run && typeof run.onTable === 'function') {
        run.onTable({
          columns: data.columns,
          rows: data.rows,
          totalRows: data.totalRows,
        })
      }
      break
    }

    case 'result': {
      const run = activeRuns.get(data.id)
      if (run) {
        run.lastResult = data.repr
        if (typeof run.onResult === 'function') {
          run.onResult(data.repr)
        }
      }
      break
    }

    case 'done': {
      finishRun(data.id, {
        ok: data.ok,
        error: data.error || null,
      })
      break
    }

    default:
      break
  }
}

/**
 * Ensure worker instance exists and setup listeners
 * @returns {Worker}
 */
function getOrCreateWorker() {
  if (worker) return worker

  if (typeof Worker === 'undefined') {
    throw new Error('Web Workers are not supported in this environment')
  }

  worker = new Worker(new URL('../../workers/pyodide.worker.js', import.meta.url), {
    type: 'module',
  })

  worker.onmessage = handleWorkerMessage

  worker.onerror = (error) => {
    console.error('Pyodide Worker Error:', error)
    updateStatus({
      state: 'error',
      message: th.runner.initFailed(error.message || 'เกิดข้อผิดพลาดในระบบรัน'),
    })
  }

  return worker
}

/**
 * Initialize Pyodide worker in background
 * @returns {Promise<{ state: string, message: string }>}
 */
export async function initRunner() {
  if (currentStatus.state === 'ready') {
    return currentStatus
  }

  if (initPromise) {
    return initPromise
  }

  const attempt = new Promise((resolve, reject) => {
    try {
      const w = getOrCreateWorker()
      updateStatus({
        state: 'loading',
        message: 'กำลังเตรียมระบบ Pyodide...',
      })

      const onStatus = (status) => {
        if (status.state === 'ready') {
          unsubscribe()
          resolve(status)
        } else if (status.state === 'error') {
          unsubscribe()
          reject(new Error(status.message))
        }
      }

      const unsubscribe = subscribeRunnerStatus(onStatus)
      w.postMessage({ type: 'init' })
    } catch (err) {
      updateStatus({
        state: 'error',
        message: err.message,
      })
      reject(err)
    }
  })

  initPromise = attempt
  // ถ้าโหลดไม่สำเร็จ ต้องไม่จำผลล้มเหลวไว้ ไม่งั้นการกดรันครั้งถัดไปจะได้ error เดิมตลอด
  // ทิ้ง worker ที่พัง แล้วล้าง initPromise ให้การรันถัดไปเริ่มโหลดใหม่ได้เอง
  // เช็กว่ายังเป็นรอบนี้อยู่ เพราะ restartRunner อาจเริ่มรอบใหม่ไปแล้ว
  attempt.catch(() => {
    if (initPromise === attempt) {
      discardWorker()
      initPromise = null
    }
  })

  return attempt
}

/**
 * ทิ้ง worker ปัจจุบันทั้งตัว ใช้ทั้งตอนหยุดโค้ดและตอนโหลด Pyodide ล้มเหลว
 */
function discardWorker() {
  if (worker) {
    worker.terminate()
    worker = null
  }
}

/**
 * ทิ้ง worker เดิมทั้งตัว แล้วเริ่ม worker ใหม่ในพื้นหลัง
 * ต้องทิ้งทั้งตัวเพราะ Pyodide หยุดโค้ดที่วนลูปจากข้างในไม่ได้
 * การรันครั้งถัดไปจะรอจนกว่า worker ใหม่โหลดเสร็จ
 * @param {'timeout' | 'user'} reason - สาเหตุที่หยุด ส่งกลับให้หน้าจอแสดงข้อความ
 */
function restartRunner(reason) {
  discardWorker()
  initPromise = null
  // ตั้งสถานะเป็น uninitialized ก่อน เพื่อให้ initRunner ไม่คืนค่า ready เดิมทันที
  updateStatus({ state: 'uninitialized', message: '' })

  for (const id of [...activeRuns.keys()]) {
    finishRun(id, { ok: false, stopped: reason })
  }

  initRunner().catch(() => {
    // สถานะ error ถูกส่งไปแล้วใน initRunner
  })
}

/**
 * Execute Python code in the Pyodide worker
 * ต้องรันทีละโค้ด เพราะ worker ทำงานได้ทีละงาน
 * timer เริ่มนับตอน worker แจ้งว่าเริ่มรันโค้ดจริง จึงไม่รวมเวลาโหลด Pyodide และ package
 * @param {object} options
 * @param {string} options.code - Python code to run
 * @param {string} [options.stdin] - Input data for input() calls
 * @param {string} [options.mode='python'] - Execution mode ('python' | 'sql')
 * @param {string[]} [options.packages] - package เพิ่มเติมจาก frontmatter ของบท
 * @param {string[]} [options.datasets] - ชื่อไฟล์ CSV ที่ต้องเขียนลง data/ ก่อนรัน
 * @param {number} [options.timeoutMs] - หยุดอัตโนมัติหลังกี่มิลลิวินาที (ค่าเริ่มต้นจาก config)
 * @param {(text: string) => void} [options.onStdout] - Stdout callback
 * @param {(text: string) => void} [options.onStderr] - Stderr callback
 * @param {(repr: string) => void} [options.onResult] - Expression result callback
 * @param {(dataUrl: string) => void} [options.onImage] - กราฟที่แปลงเป็น PNG แล้ว
 * @param {(table: object) => void} [options.onTable] - DataFrame ที่แปลงเป็นตารางแล้ว
 * @returns {Promise<{ ok: boolean, error: object | null, result: string | null, stopped: 'timeout' | 'user' | null, outputTruncated: boolean }>}
 */
export async function runCode({
  code,
  stdin = '',
  mode = 'python',
  packages = [],
  datasets = [],
  timeoutMs = config.runTimeoutMs,
  onStdout,
  onStderr,
  onResult,
  onImage,
  onTable,
}) {
  await initRunner()

  const w = getOrCreateWorker()
  const id = `run_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  return new Promise((resolve) => {
    // timer ยังไม่เริ่ม จะเริ่มเมื่อ worker แจ้งสถานะ running ของงานนี้ (ดู startRunTimer)
    const run = {
      resolve,
      onStdout,
      onStderr,
      onResult,
      onImage,
      onTable,
      lastResult: null,
      limiter: createOutputLimiter(),
      timeoutMs,
      timer: null,
    }
    activeRuns.set(id, run)

    w.postMessage({
      type: 'run',
      id,
      mode,
      code,
      stdin,
      packages,
      datasets,
    })
  })
}

/**
 * หยุดโค้ดที่กำลังรันอยู่ (ปุ่ม "หยุด")
 * ไม่มีผลถ้าไม่มีโค้ดที่กำลังรัน
 */
export function stopRun() {
  if (activeRuns.size === 0) return
  restartRunner('user')
}

/**
 * Get the current runner status
 * @returns {{ state: string, message: string }}
 */
export function getRunnerStatus() {
  return currentStatus
}

/**
 * Subscribe to runner status changes
 * @param {(status: { state: string, message: string }) => void} listener
 * @returns {() => void} Unsubscribe function
 */
export function subscribeRunnerStatus(listener) {
  statusListeners.add(listener)
  listener(currentStatus)
  return () => {
    statusListeners.delete(listener)
  }
}

/**
 * For test purposes: reset the runner client state
 */
export function _resetRunnerForTest() {
  if (worker) {
    worker.terminate()
    worker = null
  }
  for (const run of activeRuns.values()) {
    clearTimeout(run.timer)
  }
  currentStatus = {
    state: 'uninitialized',
    message: '',
  }
  statusListeners.clear()
  activeRuns.clear()
  initPromise = null
}
