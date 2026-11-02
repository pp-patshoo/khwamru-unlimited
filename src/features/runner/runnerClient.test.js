import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { th } from '../../i18n/th'
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
            data: { type: 'status', state: 'running', id: msg.id, message: '' },
          })
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

  // Worker จริงจะหยุดส่งข้อความหลัง terminate ตัวจำลองต้องทำแบบเดียวกัน
  // ไม่งั้น timer ของ worker เก่าจะส่ง ready มาทับการทดสอบรอบถัดไป
  terminate() {
    this.onmessage = null
  }
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
      // worker จริงแจ้ง running ก่อนรันโค้ด แล้วค่อยเงียบไปเมื่อวนลูป
      setTimeout(() => {
        this.onmessage?.({ data: { type: 'status', state: 'running', id: msg.id, message: '' } })
      }, 0)
      return
    }
    super.postMessage(msg)
  }
}
SilentWorker.created = 0

// worker ที่ใช้เวลาโหลด package นานกว่า timeout ก่อนจะเริ่มรันโค้ดจริง
class SlowLoadWorker extends MockWorker {
  postMessage(msg) {
    if (msg.type !== 'run') {
      super.postMessage(msg)
      return
    }
    this.messages.push(msg)
    this.onmessage({ data: { type: 'status', state: 'loading', message: 'กำลังเตรียม pandas...' } })
    setTimeout(() => {
      this.onmessage?.({ data: { type: 'status', state: 'running', id: msg.id, message: '' } })
      this.onmessage?.({ data: { type: 'done', id: msg.id, ok: true } })
    }, 60)
  }
}

// worker ที่จำข้อความ run ทั้งหมดไว้ เพื่อตรวจว่า packages และ datasets ถูกส่งต่อ
class RecordingWorker extends MockWorker {
  postMessage(msg) {
    if (msg.type === 'run') RecordingWorker.runs.push(msg)
    super.postMessage(msg)
  }
}
RecordingWorker.runs = []

// worker ตัวแรกโหลด Pyodide ไม่สำเร็จ (จำลองเน็ตหลุด) ตัวหลัง ๆ โหลดได้ปกติ
class FlakyInitWorker extends MockWorker {
  constructor() {
    super()
    FlakyInitWorker.created += 1
    this.failInit = FlakyInitWorker.created === 1
  }

  postMessage(msg) {
    if (msg.type === 'init' && this.failInit) {
      setTimeout(() => {
        this.onmessage?.({
          data: {
            type: 'status',
            state: 'error',
            message: th.runner.initFailed('เกิดข้อผิดพลาดจำลอง'),
          },
        })
      }, 0)
      return
    }
    super.postMessage(msg)
  }
}
FlakyInitWorker.created = 0

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

  it('lets the next run retry after a failed load, without reloading the page', async () => {
    global.Worker = FlakyInitWorker
    FlakyInitWorker.created = 0

    await expect(runCode({ code: 'print(1)', timeoutMs: 1000 })).rejects.toThrow(
      th.runner.initFailed('เกิดข้อผิดพลาดจำลอง'),
    )

    const response = await runCode({ code: 'print(1)', timeoutMs: 1000 })
    expect(response.ok).toBe(true)
    expect(FlakyInitWorker.created).toBe(2)
  })

  it('does nothing when stop is pressed with no running code', () => {
    expect(() => stopRun()).not.toThrow()
  })

  it('does not start the timeout while packages are still loading', async () => {
    global.Worker = SlowLoadWorker

    // timeout 20ms แต่การโหลด package ใช้ 60ms ต้องไม่ถูกหยุด
    const response = await runCode({ code: 'import pandas', timeoutMs: 20 })

    expect(response.ok).toBe(true)
    expect(response.stopped).toBeNull()
  })

  it('passes packages and datasets to the worker', async () => {
    global.Worker = RecordingWorker
    RecordingWorker.runs = []

    await runCode({
      code: 'print(1)',
      packages: ['pandas'],
      datasets: ['_test.csv'],
      timeoutMs: 1000,
    })

    expect(RecordingWorker.runs[0]).toMatchObject({
      packages: ['pandas'],
      datasets: ['_test.csv'],
    })
  })
})
