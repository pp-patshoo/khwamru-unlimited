import { config } from '../config.js'
import { parseTraceback } from '../features/runner/traceback.js'

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
        message: `ไม่สามารถโหลด Pyodide ได้: ${err.message || String(err)}`,
      })
      throw err
    }
  })()

  return pyodideLoadingPromise
}

/**
 * Run user Python code in an isolated namespace
 * @param {object} payload
 * @param {string} payload.id
 * @param {string} payload.code
 * @param {string} [payload.stdin]
 */
async function handleRun(payload) {
  const { id, code, stdin = '' } = payload
  currentRunId = id

  try {
    const py = await initPyodide()

    self.postMessage({
      type: 'status',
      state: 'running',
      message: 'กำลังรันโค้ด...',
    })

    const runHelper = py.globals.get('_run_user_code')
    // Create a fresh namespace dictionary for every run
    const userNs = py.runPython('dict()')

    let pyResult = null
    try {
      pyResult = runHelper(code, stdin, userNs)

      const hasResult = pyResult.get('has_result')
      if (hasResult) {
        const val = pyResult.get('result')
        const reprFn = py.runPython('repr')
        const reprStr = reprFn(val)
        self.postMessage({
          type: 'result',
          id,
          repr: String(reprStr),
        })
      }

      self.postMessage({
        type: 'done',
        id,
        ok: true,
      })
    } finally {
      if (pyResult && typeof pyResult.destroy === 'function') {
        pyResult.destroy()
      }
      if (userNs && typeof userNs.destroy === 'function') {
        userNs.destroy()
      }
    }
  } catch (err) {
    const rawTraceback = err.message || String(err)
    const parsed = parseTraceback(rawTraceback, '<user-code>')

    self.postMessage({
      type: 'done',
      id,
      ok: false,
      error: parsed,
    })
  } finally {
    currentRunId = null
    self.postMessage({
      type: 'status',
      state: 'ready',
      message: 'พร้อมใช้งาน',
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
