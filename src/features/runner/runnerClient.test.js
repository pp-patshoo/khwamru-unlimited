import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  initRunner,
  runCode,
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
    expect(stdoutReceived).toBe('Hello output')
    expect(resultReceived).toBe('42')
  })
})
