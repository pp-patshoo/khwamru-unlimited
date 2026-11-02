import { useId } from 'react'
import { th } from '../../i18n/th'
import styles from './StdinBox.module.css'

/**
 * ช่องกรอกข้อมูลให้ input() ของโค้ด
 * หน้าแม่จะแสดงคอมโพเนนต์นี้เฉพาะเมื่อโค้ดเรียก input()
 *
 * @param {object} props
 * @param {string} props.value - ข้อมูลที่กรอกไว้ (หนึ่งบรรทัดต่อหนึ่ง input())
 * @param {(value: string) => void} props.onChange
 * @returns {import('react').JSX.Element}
 */
export function StdinBox({ value, onChange }) {
  const inputId = useId()

  return (
    <div className={styles.box}>
      <label htmlFor={inputId} className={styles.label}>
        {th.playground.stdinLabel}
      </label>
      <textarea
        id={inputId}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.textarea}
        spellCheck={false}
      />
    </div>
  )
}

export default StdinBox
