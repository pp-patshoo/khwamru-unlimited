/**
 * Client for interacting with the Pyodide Web Worker.
 */

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
        run.onStdout(data.text)
      }
      break
    }

    case 'stderr': {
      const run = activeRuns.get(data.id)
      if (run && typeof run.onStderr === 'function') {
        run.onStderr(data.text)
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
      const run = activeRuns.get(data.id)
      if (run) {
        activeRuns.delete(data.id)
        run.resolve({
          ok: data.ok,
          error: data.error || null,
          result: run.lastResult || null,
        })
      }
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
 * Execute Python code in the Pyodide worker
 * @param {object} options
 * @param {string} options.code - Python code to run
 * @param {string} [options.stdin] - Input data for input() calls
 * @param {string} [options.mode='python'] - Execution mode ('python' | 'sql')
 * @param {(text: string) => void} [options.onStdout] - Stdout callback
 * @param {(text: string) => void} [options.onStderr] - Stderr callback
 * @param {(repr: string) => void} [options.onResult] - Expression result callback
 * @returns {Promise<{ ok: boolean, error: object | null, result: string | null }>}
 */
export async function runCode({
  code,
  stdin = '',
  mode = 'python',
  onStdout,
  onStderr,
  onResult,
}) {
  await initRunner()

  const w = getOrCreateWorker()
  const id = `run_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  return new Promise((resolve) => {
    activeRuns.set(id, {
      resolve,
      onStdout,
      onStderr,
      onResult,
      lastResult: null,
    })

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
  currentStatus = {
    state: 'uninitialized',
    message: '',
  }
  statusListeners.clear()
  activeRuns.clear()
  initPromise = null
}

