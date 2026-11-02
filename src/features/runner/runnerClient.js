/**
 * Client for interacting with the Pyodide Web Worker.
 */
import { config } from '../../config.js'
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
      message: error.message || 'Worker encounter an error',
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

  initPromise = new Promise((resolve, reject) => {
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

  return initPromise
}

/**
 * ทิ้ง worker เดิมทั้งตัว แล้วเริ่ม worker ใหม่ในพื้นหลัง
 * ต้องทิ้งทั้งตัวเพราะ Pyodide หยุดโค้ดที่วนลูปจากข้างในไม่ได้
 * การรันครั้งถัดไปจะรอจนกว่า worker ใหม่โหลดเสร็จ
 * @param {'timeout' | 'user'} reason - สาเหตุที่หยุด ส่งกลับให้หน้าจอแสดงข้อความ
 */
function restartRunner(reason) {
  if (worker) {
    worker.terminate()
    worker = null
  }
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
 * timer นับหลัง worker พร้อมแล้ว จึงไม่รวมเวลาโหลด Pyodide
 * @param {object} options
 * @param {string} options.code - Python code to run
 * @param {string} [options.stdin] - Input data for input() calls
 * @param {string} [options.mode='python'] - Execution mode ('python' | 'sql')
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
    const run = {
      resolve,
      onStdout,
      onStderr,
      onResult,
      onImage,
      onTable,
      lastResult: null,
      limiter: createOutputLimiter(),
      timer: null,
    }
    run.timer = setTimeout(() => restartRunner('timeout'), timeoutMs)
    activeRuns.set(id, run)

    w.postMessage({
      type: 'run',
      id,
      mode,
      code,
      stdin,
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
