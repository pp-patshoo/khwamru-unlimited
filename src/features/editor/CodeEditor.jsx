import { useEffect, useMemo, useRef } from 'react'
import CodeMirror, { EditorView, Prec, keymap } from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { sql } from '@codemirror/lang-sql'
import { th } from '../../i18n/th'
import styles from './CodeEditor.module.css'

/**
 * ช่องเขียนโค้ด CodeMirror สำหรับ Python และ SQL
 * - ย่อหน้าครั้งละ 4 ช่องว่าง และ Tab ใส่ 4 ช่องว่าง
 * - Mod-Enter คือ Ctrl+Enter บน Windows (Cmd+Enter บน Mac) ใช้รันโค้ด
 * - Esc ย้าย focus ออกจากช่อง เพราะ Tab ถูกใช้สำหรับย่อหน้า ไม่งั้นคีย์บอร์ดจะออกจากช่องไม่ได้
 *
 * @param {object} props
 * @param {'python' | 'sql'} [props.language='python'] - ภาษาที่ใช้ไฮไลต์และ autocomplete
 * @param {string} props.value - โค้ดปัจจุบัน
 * @param {(value: string) => void} props.onChange - เรียกทุกครั้งที่โค้ดเปลี่ยน
 * @param {() => void} [props.onRun] - เรียกเมื่อกด Ctrl+Enter
 * @returns {import('react').JSX.Element}
 */
export function CodeEditor({ language = 'python', value, onChange, onRun }) {
  // เก็บ onRun ไว้ใน ref เพื่อให้ keymap เรียกค่าล่าสุดโดยไม่ต้องสร้าง extension ใหม่ทุกครั้งที่ render
  const runRef = useRef(onRun)
  useEffect(() => {
    runRef.current = onRun
  }, [onRun])

  const extensions = useMemo(
    () => [
      language === 'sql' ? sql() : python(),
      EditorView.contentAttributes.of({ 'aria-label': th.playground.editorLabel }),
      // Prec.highest จำเป็น เพราะ basicSetup ผูก Mod-Enter ไว้กับ insertBlankLine
      // ถ้าไม่ยกความสำคัญ การกด Ctrl+Enter จะขึ้นบรรทัดว่างแทนการรัน
      Prec.highest(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              runRef.current?.()
              return true
            },
          },
          {
            key: 'Escape',
            run: (view) => {
              view.contentDOM.blur()
              return true
            },
          },
        ]),
      ),
    ],
    [language],
  )

  return (
    <div className={styles.editor}>
      <CodeMirror
        value={value}
        onChange={(newValue) => onChange(newValue)}
        extensions={extensions}
        theme="none"
        basicSetup={{
          tabSize: 4,
          lineNumbers: true,
          foldGutter: false,
          autocompletion: false,
        }}
      />
    </div>
  )
}

export default CodeEditor
