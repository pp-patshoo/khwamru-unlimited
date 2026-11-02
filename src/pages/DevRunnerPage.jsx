import { useState } from 'react'
import { Button } from '../components/Button'
import { CodePlayground } from '../features/runner/CodePlayground'
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
  {
    key: 'presetInfinite',
    code: 'while True:\n    pass',
    stdin: '',
  },
  {
    key: 'presetLongOutput',
    code: 'for i in range(20000):\n    print(i)',
    stdin: '',
  },
]

/**
 * Dev test page for the Code Playground (T1.2)
 * เปลี่ยนตัวอย่างทีหนึ่งจะสร้าง playground ใหม่ทั้งชุด เพื่อให้โค้ดและ output เริ่มต้นใหม่
 * @returns {import('react').JSX.Element}
 */
export function DevRunnerPage() {
  const [selected, setSelected] = useState({ index: 0, nonce: 0 })
  const preset = PRESETS[selected.index]

  const handleApplyPreset = (index) => {
    setSelected((prev) => ({ index, nonce: prev.nonce + 1 }))
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{th.devRunner.title}</h1>
        <p className={styles.description}>{th.devRunner.description}</p>
      </header>

      <section className={styles.presetsSection}>
        <h2 className={styles.presetsTitle}>{th.devRunner.presetsLabel}</h2>
        <div className={styles.presetsList}>
          {PRESETS.map((item, index) => (
            <Button
              key={item.key}
              variant="secondary"
              size="sm"
              onClick={() => handleApplyPreset(index)}
            >
              {th.devRunner[item.key]}
            </Button>
          ))}
        </div>
      </section>

      <CodePlayground
        key={selected.nonce}
        initialCode={preset.code}
        initialStdin={preset.stdin}
      />
    </div>
  )
}

export default DevRunnerPage
