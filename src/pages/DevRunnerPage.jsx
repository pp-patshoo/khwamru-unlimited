import { useState, useEffect } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import {
  runCode,
  getRunnerStatus,
  subscribeRunnerStatus,
} from '../features/runner/runnerClient'
import { th } from '../i18n/th'
import styles from './DevRunnerPage.module.css'

const PRESETS = [
  {
    key: 'presetHello',
    code: 'print("สวัสดี")',
    stdin: '',
  },
  {
    key: 'presetStdin',
    code: 'name = input("ชื่อของคุณ: ")\nage = input("อายุของคุณ: ")\nprint(f"สวัสดีคุณ {name} อายุ {age} ปี")',
    stdin: 'สมชาย\n25',
  },
  {
    key: 'presetError',
    code: 'x = 10\ny = 0\nprint("กำลังจะหารด้วยศูนย์")\nz = x / y\nprint("เสร็จสิ้น")',
    stdin: '',
  },
  {
    key: 'presetLastExpr',
    code: 'x = 1\n1 + 1',
    stdin: '',
  },
  {
    key: 'presetNamespace',
    code: '# รอบแรกกำหนด my_var = 100\n# หากรันซ้ำหรือรันโค้ดอื่น จะต้องไม่พบ my_var\nprint("ค่าของ my_var:", my_var)',
    stdin: '',
  },
]

/**
 * Dev test page for Pyodide Web Worker (T1.1)
 * @returns {import('react').JSX.Element}
 */
export function DevRunnerPage() {
  const [status, setStatus] = useState(getRunnerStatus())
  const [code, setCode] = useState(PRESETS[0].code)
  const [stdin, setStdin] = useState(PRESETS[0].stdin)
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    const unsub = subscribeRunnerStatus((newStatus) => {
      setStatus(newStatus)
    })
    return unsub
  }, [])

  const handleApplyPreset = (preset) => {
    setCode(preset.code)
    setStdin(preset.stdin)
  }

  const handleRun = async () => {
    setIsRunning(true)
    setStdout('')
    setStderr('')
    setResult(null)
    setError(null)

    try {
      const res = await runCode({
        code,
        stdin,
        onStdout: (text) => setStdout((prev) => (prev ? `${prev}\n${text}` : text)),
        onStderr: (text) => setStderr((prev) => (prev ? `${prev}\n${text}` : text)),
        onResult: (repr) => setResult(repr),
      })

      if (!res.ok && res.error) {
        setError(res.error)
      }
    } catch (err) {
      setError({
        type: 'RunnerError',
        message: err.message,
        line: null,
        traceback: err.stack || String(err),
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusBadgeVariant = (state) => {
    switch (state) {
      case 'ready':
        return 'success'
      case 'running':
      case 'loading':
        return 'warning'
      case 'error':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{th.devRunner.title}</h1>
        <p className={styles.description}>{th.devRunner.description}</p>
      </header>

      <section className={styles.statusBar} aria-live="polite">
        <span className={styles.statusLabel}>{th.devRunner.statusLabel}</span>
        <Badge variant={getStatusBadgeVariant(status.state)}>
          {th.runner.status[status.state] || status.state}
        </Badge>
        {status.message && (
          <span className={styles.statusMessage}>{status.message}</span>
        )}
      </section>

      <section className={styles.presetsSection}>
        <h2 className={styles.presetsTitle}>{th.devRunner.presetsLabel}</h2>
        <div className={styles.presetsList}>
          {PRESETS.map((preset) => (
            <Button
              key={preset.key}
              variant="secondary"
              size="sm"
              onClick={() => handleApplyPreset(preset)}
            >
              {th.devRunner[preset.key]}
            </Button>
          ))}
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.inputGroup}>
          <label htmlFor="dev-runner-code" className={styles.label}>
            {th.devRunner.codeLabel}
          </label>
          <textarea
            id="dev-runner-code"
            rows={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.codeArea}
            spellCheck="false"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dev-runner-stdin" className={styles.label}>
            {th.devRunner.stdinLabel}
          </label>
          <textarea
            id="dev-runner-stdin"
            rows={3}
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            className={styles.stdinArea}
            spellCheck="false"
          />
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="md"
            onClick={handleRun}
            disabled={isRunning || status.state === 'loading'}
          >
            {isRunning ? th.devRunner.runningButton : th.devRunner.runButton}
          </Button>
        </div>
      </section>

      <section className={styles.outputGrid}>
        <Card className={styles.outputCard}>
          <h3 className={styles.outputTitle}>{th.devRunner.stdoutLabel}</h3>
          <pre className={styles.outputPre}>{stdout || th.devRunner.noOutput}</pre>
        </Card>

        {stderr && (
          <Card className={styles.outputCard}>
            <h3 className={styles.outputTitle}>{th.devRunner.stderrLabel}</h3>
            <pre className={styles.outputPre}>{stderr}</pre>
          </Card>
        )}

        {result !== null && (
          <Card className={styles.outputCard}>
            <h3 className={styles.outputTitle}>{th.devRunner.resultLabel}</h3>
            <pre className={`${styles.outputPre} ${styles.resultPre}`}>{result}</pre>
          </Card>
        )}

        {error && (
          <Card className={styles.outputCard}>
            <h3 className={styles.outputTitle}>{th.devRunner.errorLabel}</h3>
            <div className={styles.errorBox}>
              <div className={styles.errorField}>
                <strong>{th.devRunner.errorType}</strong> {error.type}
              </div>
              <div className={styles.errorField}>
                <strong>{th.devRunner.errorLine}</strong>{' '}
                {error.line !== null ? error.line : '-'}
              </div>
              <div className={styles.errorField}>
                <strong>{th.devRunner.errorMessage}</strong> {error.message}
              </div>
              {error.traceback && (
                <div>
                  <strong>{th.devRunner.tracebackLabel}</strong>
                  <pre className={styles.tracebackPre}>{error.traceback}</pre>
                </div>
              )}
            </div>
          </Card>
        )}
      </section>
    </div>
  )
}

export default DevRunnerPage

