import { Play, RotateCcw, Square } from 'lucide-react'
import { Button } from '../../components/Button'
import { th } from '../../i18n/th'
import styles from './RunControls.module.css'

/**
 * ปุ่มควบคุมการรัน: รัน, หยุด และรีเซ็ตโค้ด
 * ปุ่ม "หยุด" ใช้ได้เฉพาะตอนที่โค้ดกำลังรัน
 *
 * @param {object} props
 * @param {boolean} props.isRunning - โค้ดกำลังรันอยู่หรือไม่
 * @param {() => void} props.onRun
 * @param {() => void} props.onStop
 * @param {() => void} props.onReset
 * @returns {import('react').JSX.Element}
 */
export function RunControls({ isRunning, onRun, onStop, onReset }) {
  return (
    <div className={styles.controls} role="group" aria-label={th.playground.controlsLabel}>
      <Button
        variant="primary"
        size="sm"
        icon={<Play className={styles.icon} />}
        onClick={onRun}
        disabled={isRunning}
        className={styles.runButton}
        title={th.playground.runShortcut}
      >
        {isRunning ? th.playground.runningButton : th.playground.runButton}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        icon={<Square className={styles.icon} />}
        onClick={onStop}
        disabled={!isRunning}
      >
        {th.playground.stopButton}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        icon={<RotateCcw className={styles.icon} />}
        onClick={onReset}
        disabled={isRunning}
      >
        {th.playground.resetButton}
      </Button>
    </div>
  )
}

export default RunControls
