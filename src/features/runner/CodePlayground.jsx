import { useEffect, useState } from 'react'
import { Badge } from '../../components/Badge'
import { th } from '../../i18n/th'
import { CodeEditor } from '../editor/CodeEditor'
import { OutputPanel } from './OutputPanel'
import { RunControls } from './RunControls'
import { StdinBox } from './StdinBox'
import { getRunNotice } from './runNotice'
import { needsStdin } from './stdinUtils'
import { getRunnerStatus, runCode, stopRun, subscribeRunnerStatus } from './runnerClient'
import styles from './CodePlayground.module.css'

const EMPTY_OUTPUT = {
  stdout: '',
  stderr: '',
  result: null,
  error: null,
  notice: null,
  images: [],
  table: null,
}

/**
 * ต่อบรรทัดใหม่เข้ากับ output เดิม (บรรทัดแรกไม่มีบรรทัดนำหน้า)
 * @param {string} previous
 * @param {string} text
 * @returns {string}
 */
function appendLine(previous, text) {
  return previous ? `${previous}\n${text}` : text
}

/**
 * ชุดเครื่องมือรันโค้ดครบชุด: editor, ปุ่มควบคุม, ช่อง input() และ output
 * @param {object} props
 * @param {string} [props.initialCode=''] - โค้ดเริ่มต้น (ใช้กับปุ่มรีเซ็ต)
 * @param {string} [props.initialStdin=''] - ข้อมูล input() เริ่มต้น
 * @param {'python' | 'sql'} [props.language='python']
 * @param {string[]} [props.packages=[]] - package เพิ่มเติมจาก frontmatter ของบท
 * @param {string[]} [props.datasets=[]] - ไฟล์ CSV ที่ต้องเตรียมไว้ในโฟลเดอร์ data/
 * @returns {import('react').JSX.Element}
 */
export function CodePlayground({
  initialCode = '',
  initialStdin = '',
  language = 'python',
  packages = [],
  datasets = [],
}) {
  const [code, setCode] = useState(initialCode)
  const [stdin, setStdin] = useState(initialStdin)
  const [output, setOutput] = useState(EMPTY_OUTPUT)
  const [isRunning, setIsRunning] = useState(false)
  const [runnerStatus, setRunnerStatus] = useState(getRunnerStatus())

  useEffect(() => subscribeRunnerStatus(setRunnerStatus), [])

  // ข้อความความคืบหน้าตอนโหลด package เช่น "กำลังเตรียม pandas..." (ใช้เฉพาะตอนกำลังโหลดหรือรัน)
  const progressMessage = ['loading', 'running'].includes(runnerStatus.state)
    ? runnerStatus.message
    : ''

  const handleRun = async () => {
    if (isRunning) return

    setIsRunning(true)
    setOutput(EMPTY_OUTPUT)

    try {
      const res = await runCode({
        code,
        stdin,
        packages,
        datasets,
        onStdout: (text) => setOutput((prev) => ({ ...prev, stdout: appendLine(prev.stdout, text) })),
        onStderr: (text) => setOutput((prev) => ({ ...prev, stderr: appendLine(prev.stderr, text) })),
        onResult: (repr) => setOutput((prev) => ({ ...prev, result: repr })),
        onImage: (dataUrl) => setOutput((prev) => ({ ...prev, images: [...prev.images, dataUrl] })),
        onTable: (table) => setOutput((prev) => ({ ...prev, table })),
      })

      setOutput((prev) => ({
        ...prev,
        error: res.ok ? null : res.error,
        notice: getRunNotice(res),
      }))
    } catch (err) {
      setOutput((prev) => ({
        ...prev,
        error: {
          type: 'RunnerError',
          message: err.message,
          line: null,
          traceback: err.stack || String(err),
        },
      }))
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setCode(initialCode)
    setStdin(initialStdin)
    setOutput(EMPTY_OUTPUT)
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
    <section className={styles.playground} aria-label={th.playground.sectionLabel}>
      <div className={styles.toolbar}>
        <RunControls
          isRunning={isRunning}
          onRun={handleRun}
          onStop={stopRun}
          onReset={handleReset}
        />
        <Badge variant={getStatusBadgeVariant(runnerStatus.state)}>
          {th.runner.status[runnerStatus.state] || runnerStatus.state}
        </Badge>
      </div>

      <CodeEditor language={language} value={code} onChange={setCode} onRun={handleRun} />

      {needsStdin(code) && <StdinBox value={stdin} onChange={setStdin} />}

      <OutputPanel output={output} isRunning={isRunning} progressMessage={progressMessage} />
    </section>
  )
}

export default CodePlayground
