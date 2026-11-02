import { config } from '../config.js'
import { th } from '../i18n/th.js'
import { parseTraceback } from '../features/runner/traceback.js'
import { PYTHON_HELPERS } from './pythonHelpers.js'
import { PrepareError, prepareEnvironment } from './environment.js'

let pyodideInstance = null
let pyodideLoadingPromise = null
let currentRunId = null

const PYTHON_BOOTSTRAP = `
import ast
import sys
import io

class StdinReader(io.StringIO):
    def __init__(self, initial_value=''):
        super().__init__(initial_value)

    def readline(self, size=-1):
        line = super().readline(size)
        if not line:
            raise EOFError("ข้อมูลสำหรับ input() หมดแล้ว กรุณากรอกข้อมูลเพิ่มในช่อง input")
        return line

def _run_user_code(code_str, stdin_str, ns):
    sys.stdin = StdinReader(stdin_str)
    tree = ast.parse(code_str, filename="<user-code>", mode="exec")
    if tree.body and isinstance(tree.body[-1], ast.Expr):
        last_expr = tree.body.pop()
        if tree.body:
            code_obj = compile(tree, filename="<user-code>", mode="exec")
            exec(code_obj, ns)
        expr_obj = compile(ast.Expression(body=last_expr.value), filename="<user-code>", mode="eval")
        result = eval(expr_obj, ns)
        return {"has_result": result is not None, "result": result}
    else:
        code_obj = compile(tree, filename="<user-code>", mode="exec")
        exec(code_obj, ns)
        return {"has_result": False, "result": None}
`

/**
 * Initialize Pyodide instance and prepare Python environment
 * @returns {Promise<any>}
 */
async function initPyodide() {
  if (pyodideInstance) {
    return pyodideInstance
  }

  if (pyodideLoadingPromise) {
    return pyodideLoadingPromise
  }

  pyodideLoadingPromise = (async () => {
    try {
      self.postMessage({
        type: 'status',
        state: 'loading',
        message: 'กำลังเตรียมระบบรันโค้ด Python (Pyodide)...',
      })

      // Dynamic import of Pyodide ESM module
      const { loadPyodide } = await import(config.pyodideMjsUrl)

      const instance = await loadPyodide({
        indexURL: config.pyodideIndexUrl,
      })

      // Setup stdout & stderr forwarding
      instance.setStdout({
        batched: (text) => {
          if (currentRunId) {
            self.postMessage({
              type: 'stdout',
              id: currentRunId,
              text,
            })
          }
        },
      })

      instance.setStderr({
        batched: (text) => {
          if (currentRunId) {
            self.postMessage({
              type: 'stderr',
              id: currentRunId,
              text,
            })
          }
        },
      })

      // Run bootstrap helpers
      instance.runPython(PYTHON_BOOTSTRAP)
      instance.runPython(PYTHON_HELPERS)

      pyodideInstance = instance

      self.postMessage({
        type: 'status',
        state: 'ready',
        message: 'พร้อมใช้งาน',
      })

      return instance
    } catch (err) {
      pyodideLoadingPromise = null
      self.postMessage({
        type: 'status',
        state: 'error',
        message: th.runner.initFailed(err.message || String(err)),
      })
      throw err
    }
  })()

  return pyodideLoadingPromise
}

/**
 * รันโค้ดของผู้เรียนใน namespace ใหม่ และส่งค่าบรรทัดสุดท้ายกลับไป
 * @param {any} py
 * @param {string} id
 * @param {string} code
 * @param {string} stdin
 */
function runUserCode(py, id, code, stdin) {
  const runHelper = py.globals.get('_run_user_code')
  // Create a fresh namespace dictionary for every run
  const userNs = py.runPython('dict()')
  let pyResult = null

  try {
    pyResult = runHelper(code, stdin, userNs)
    if (pyResult.get('has_result')) {
      postExpressionValue(py, id, pyResult.get('result'))
    }
  } finally {
    if (pyResult && typeof pyResult.destroy === 'function') {
      pyResult.destroy()
    }
    if (userNs && typeof userNs.destroy === 'function') {
      userNs.destroy()
    }
  }
}

/**
 * ค่าบรรทัดสุดท้าย: DataFrame หรือ Series ส่งเป็นตาราง ค่าอื่นส่งเป็นข้อความ
 * @param {any} py
 * @param {string} id
 * @param {any} value
 */
function postExpressionValue(py, id, value) {
  if (py.globals.get('_is_table')(value)) {
    const table = JSON.parse(py.globals.get('_table_json')(value, config.tableMaxRows))
    self.postMessage({ type: 'table', id, ...table })
    return
  }

  const reprFn = py.runPython('repr')
  self.postMessage({
    type: 'result',
    id,
    repr: String(reprFn(value)),
  })
}

/**
 * ส่งกราฟทุกอันที่เปิดค้างไว้เป็น PNG
 * ต้องส่งก่อนข้อความ done เพราะหลัง done ฝั่งหน้าเว็บจะไม่รับข้อความของการรันนี้แล้ว
 * @param {any} py
 * @param {string} id
 */
function postFigures(py, id) {
  try {
    const images = JSON.parse(py.globals.get('_collect_figures')())
    for (const dataUrl of images) {
      self.postMessage({ type: 'image', id, dataUrl })
    }
  } catch {
    self.postMessage({ type: 'stderr', id, text: th.runner.prepare.figureFailed })
  }
}

/**
 * แปลง error เป็นรูปแบบที่หน้าจอแสดงได้
 * @param {unknown} err
 * @returns {object}
 */
function toErrorObject(err) {
  if (err instanceof PrepareError) {
    return { type: 'PrepareError', message: err.message, line: null, traceback: '' }
  }
  const rawTraceback = err.message || String(err)
  return parseTraceback(rawTraceback, '<user-code>')
}

/**
 * Run user Python code in an isolated namespace
 * @param {object} payload
 * @param {string} payload.id
 * @param {string} payload.code
 * @param {string} [payload.stdin]
 * @param {string[]} [payload.packages]
 * @param {string[]} [payload.datasets]
 */
async function handleRun(payload) {
  const { id, code, stdin = '', packages = [], datasets = [] } = payload
  currentRunId = id

  let py = null
  let outcome = { ok: true, error: null }

  try {
    py = await initPyodide()

    await prepareEnvironment(py, {
      code,
      packages,
      datasets,
      onProgress: (message) => self.postMessage({ type: 'status', state: 'loading', message }),
    })

    // ส่ง id ไปด้วย เพื่อให้หน้าเว็บเริ่มนับเวลาหยุดอัตโนมัติเฉพาะตอนเริ่มรันโค้ดจริง
    self.postMessage({
      type: 'status',
      id,
      state: 'running',
      message: th.runner.runningMessage,
    })

    runUserCode(py, id, code, stdin)
  } catch (err) {
    outcome = { ok: false, error: toErrorObject(err) }
  }

  if (py) {
    postFigures(py, id)
  }

  self.postMessage({ type: 'done', id, ...outcome })

  currentRunId = null
  // ส่ง ready เฉพาะเมื่อ Pyodide โหลดได้ มิฉะนั้นจะทับข้อความ error ที่ initPyodide ส่งไปแล้ว
  if (py) {
    self.postMessage({
      type: 'status',
      state: 'ready',
      message: th.runner.readyMessage,
    })
  }
}

// Worker message listener
self.onmessage = async (event) => {
  const data = event.data
  if (!data || !data.type) return

  switch (data.type) {
    case 'init':
      try {
        await initPyodide()
      } catch {
        // error status already posted
      }
      break

    case 'run':
      await handleRun(data)
      break

    default:
      break
  }
}
