import { describe, it, expect } from 'vitest'
import { parseTraceback } from './traceback'

describe('parseTraceback', () => {
  it('parses runtime error with internal Pyodide frames correctly and extracts user line number', () => {
    const rawTraceback = `Traceback (most recent call last):
  File "/lib/python3.14/site-packages/pyodide/_base.py", line 512, in eval_code
    return CodeRunner(
  File "/lib/python3.14/site-packages/pyodide/_base.py", line 363, in run
    coroutine = eval(self.code, globals, locals)
  File "<user-code>", line 3, in <module>
    print(unknown_variable)
NameError: name 'unknown_variable' is not defined`

    const parsed = parseTraceback(rawTraceback)

    expect(parsed.type).toBe('NameError')
    expect(parsed.message).toBe("name 'unknown_variable' is not defined")
    expect(parsed.line).toBe(3)
    // Internal Pyodide frames should be filtered out
    expect(parsed.traceback).not.toContain('_base.py')
    expect(parsed.traceback).toContain('File "<user-code>", line 3')
    expect(parsed.traceback).toContain("NameError: name 'unknown_variable' is not defined")
  })

  it('parses SyntaxError with line indicator', () => {
    const rawTraceback = `  File "<user-code>", line 2
    print("สวัสดี"
                 ^
SyntaxError: '(' was never closed`

    const parsed = parseTraceback(rawTraceback)

    expect(parsed.type).toBe('SyntaxError')
    expect(parsed.message).toBe("'(' was never closed")
    expect(parsed.line).toBe(2)
    expect(parsed.traceback).toContain('line 2')
  })

  it('parses ZeroDivisionError on line 1', () => {
    const rawTraceback = `Traceback (most recent call last):
  File "<user-code>", line 1, in <module>
    x = 10 / 0
ZeroDivisionError: division by zero`

    const parsed = parseTraceback(rawTraceback)

    expect(parsed.type).toBe('ZeroDivisionError')
    expect(parsed.message).toBe('division by zero')
    expect(parsed.line).toBe(1)
  })

  it('selects the innermost user frame when user code has function calls', () => {
    const rawTraceback = `Traceback (most recent call last):
  File "<user-code>", line 6, in <module>
    calculate()
  File "<user-code>", line 2, in calculate
    return 100 / 0
ZeroDivisionError: division by zero`

    const parsed = parseTraceback(rawTraceback)

    expect(parsed.type).toBe('ZeroDivisionError')
    expect(parsed.line).toBe(2)
  })

  it('handles empty or malformed input safely', () => {
    expect(parseTraceback('')).toEqual({
      type: 'Error',
      message: '',
      line: null,
      traceback: '',
    })

    expect(parseTraceback(null)).toEqual({
      type: 'Error',
      message: '',
      line: null,
      traceback: '',
    })
  })
})

