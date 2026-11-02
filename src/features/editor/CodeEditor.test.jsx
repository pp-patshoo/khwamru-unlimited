import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { CodeEditor } from './CodeEditor'

// test นี้ใช้ CodeMirror จริง เพราะปัญหาปุ่มลัดเกิดจากลำดับ keymap ของ basicSetup
describe('CodeEditor', () => {
  it('runs the code on Ctrl+Enter instead of inserting a blank line', () => {
    const onRun = vi.fn()
    const onChange = vi.fn()
    const { container } = render(
      <CodeEditor value="print(1)" onChange={onChange} onRun={onRun} />,
    )

    const content = container.querySelector('.cm-content')
    fireEvent.keyDown(content, { key: 'Enter', ctrlKey: true })

    expect(onRun).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()
  })
})
