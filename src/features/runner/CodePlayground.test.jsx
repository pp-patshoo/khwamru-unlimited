import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CodePlayground } from './CodePlayground'
import { runCode, stopRun } from './runnerClient'
import { th } from '../../i18n/th'

vi.mock('./runnerClient', () => ({
  runCode: vi.fn(),
  stopRun: vi.fn(),
  getRunnerStatus: vi.fn(() => ({ state: 'ready', message: '' })),
  subscribeRunnerStatus: vi.fn(() => () => {}),
}))

// แทน CodeMirror ด้วย textarea เพราะ CodeMirror ทำงานได้ไม่เต็มที่ใน jsdom
vi.mock('../editor/CodeEditor', () => ({
  CodeEditor: ({ value, onChange }) => (
    <textarea aria-label="editor" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}))

const SUCCESS = { ok: true, error: null, result: null, stopped: null, outputTruncated: false }

describe('CodePlayground', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    runCode.mockResolvedValue(SUCCESS)
  })

  it('runs the code currently in the editor', () => {
    render(<CodePlayground initialCode='print("สวัสดี")' />)

    fireEvent.click(screen.getByRole('button', { name: th.playground.runButton }))

    expect(runCode).toHaveBeenCalledWith(expect.objectContaining({ code: 'print("สวัสดี")' }))
  })

  it('shows the stdin box only when the code calls input()', () => {
    const { unmount } = render(<CodePlayground initialCode='print("hi")' />)
    expect(screen.queryByLabelText(th.playground.stdinLabel)).toBeNull()
    unmount()

    render(<CodePlayground initialCode='name = input("ชื่อ: ")' />)
    expect(screen.getByLabelText(th.playground.stdinLabel)).toBeInTheDocument()
  })

  it('shows a Thai notice when the code is stopped by the timeout', async () => {
    runCode.mockResolvedValue({ ...SUCCESS, ok: false, stopped: 'timeout' })
    render(<CodePlayground initialCode="while True: pass" />)

    fireEvent.click(screen.getByRole('button', { name: th.playground.runButton }))

    expect(await screen.findByText(th.playground.timeoutStopped)).toBeInTheDocument()
  })

  it('enables the stop button while code is running and calls stopRun when clicked', () => {
    runCode.mockReturnValue(new Promise(() => {}))
    render(<CodePlayground initialCode="while True: pass" />)

    const stopButton = screen.getByRole('button', { name: th.playground.stopButton })
    expect(stopButton).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: th.playground.runButton }))
    expect(screen.getByRole('button', { name: th.playground.stopButton })).toBeEnabled()

    fireEvent.click(screen.getByRole('button', { name: th.playground.stopButton }))
    expect(stopRun).toHaveBeenCalled()
  })

  it('restores the initial code when reset is clicked', () => {
    render(<CodePlayground initialCode="a = 1" />)

    fireEvent.change(screen.getByLabelText('editor'), { target: { value: 'b = 2' } })
    fireEvent.click(screen.getByRole('button', { name: th.playground.resetButton }))

    expect(screen.getByLabelText('editor')).toHaveValue('a = 1')
  })
})
