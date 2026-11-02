import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  initRunner,
  runCode,
  stopRun,
  getRunnerStatus,
  subscribeRunnerStatus,
  _resetRunnerForTest,
} from './runnerClient'

class MockWorker {
  constructor() {
    this.onmessage = null
    this.onerror = null
    this.messages = []
  }

  postMessage(msg) {
    this.messages.push(msg)

    if (msg.type === 'init') {
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({
            data: { type: 'status', state: 'ready', message: 'พร้อมใช้งาน' },
          })
        }
      }, 0)
    }

    if (msg.type === 'run') {
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({
            data: { type: 'stdout', id: msg.id, text: 'Hello output' },
          })
          this.onmessage({
            data: { type: 'result', id: msg.id, repr: '42' },
          })
          this.onmessage({
            data: { type: 'done', id: msg.id, ok: true },
          })
        }
      }, 0)
    }
  }

  terminate() {}
}

// worker ที่ไม่ตอบกลับเมื่อโค้ดมีคำว่า hang (จำลองโค้ดที่วนลูปไม่หยุด)
class SilentWorker extends MockWorker {
  constructor() {
    super()
    SilentWorker.created += 1
  }

  postMessage(msg) {
    if (msg.type === 'run' && msg.code.includes('hang')) {
      this.messages.push(msg)
      return
    }
    super.postMessage(msg)
  }
}
SilentWorker.created = 0

describe('runnerClient', () => {
  const originalWorker = global.Worker

  beforeEach(() => {
    _resetRunnerForTest()
    global.Worker = MockWorker
  })

  afterEach(() => {
    _resetRunnerForTest()
    global.Worker = originalWorker
  })

  it('subscribes to status updates', () => {
    const statusHistory = []
    const unsub = subscribeRunnerStatus((status) => {
      statusHistory.push(status.state)
    })

    expect(statusHistory).toContain('uninitialized')
    unsub()
  })

  it('initializes the runner and updates status to ready', async () => {
    const initRes = await initRunner()
    expect(initRes.state).toBe('ready')
    expect(getRunnerStatus().state).toBe('ready')
  })

  it('runs code and receives stdout, result, and done status', async () => {
    let stdoutReceived = ''
    let resultReceived = ''

    const response = await runCode({
      code: 'print("Hello")',
      onStdout: (text) => {
        stdoutReceived = text
      },
      onResult: (repr) => {
        resultReceived = repr
      },
    })

    expect(response.ok).toBe(true)
    expect(response.result).toBe('42')
    expect(response.stopped).toBeNull()
    expect(response.outputTruncated).toBe(false)
    expect(stdoutReceived).toBe('Hello output')
    expect(resultReceived).toBe('42')
  })

  it('stops code that runs past the timeout and starts a fresh worker', async () => {
    global.Worker = SilentWorker
    SilentWorker.created = 0

    const response = await runCode({ code: 'hang', timeoutMs: 20 })

    expect(response.ok).toBe(false)
    expect(response.stopped).toBe('timeout')
    expect(SilentWorker.created).toBe(2)
  })

  it('runs normally again after a timeout stop', async () => {
    global.Worker = SilentWorker

    await runCode({ code: 'hang', timeoutMs: 20 })
    const response = await runCode({ code: 'print(1)', timeoutMs: 1000 })

    expect(response.ok).toBe(true)
    expect(response.stopped).toBeNull()
  })

  it('stops code when the learner presses stop', async () => {
    global.Worker = SilentWorker

    const pending = runCode({ code: 'hang', timeoutMs: 60000 })
    // รอให้ runCode ลงทะเบียนงานหลัง worker พร้อม
    await new Promise((resolve) => setTimeout(resolve, 10))
    stopRun()

    const response = await pending
    expect(response.ok).toBe(false)
    expect(response.stopped).toBe('user')
  })

  it('does nothing when stop is pressed with no running code', () => {
    expect(() => stopRun()).not.toThrow()
  })
})
