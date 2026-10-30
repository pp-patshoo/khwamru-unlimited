import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Callout } from '../components/Callout'
import { Badge } from '../components/Badge'
import { ProgressBar } from '../components/ProgressBar'
import { Modal } from '../components/Modal'
import { Toast } from '../components/Toast'
import { Tooltip } from '../components/Tooltip'
import { getContrastRatio, isContrastPassing } from '../utils/contrast'
import { CONTRAST_PAIRS } from '../utils/contrastPairs'
import { th } from '../i18n/th'
import styles from './DevComponentsPage.module.css'

/**
 * Dev Showcase Page demonstrating all design system components and contrast checks.
 * @returns {import('react').JSX.Element}
 */
export function DevComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isToastOpen, setIsToastOpen] = useState(false)

  return (
    <div className={styles.container}>
      <header className={styles.intro}>
        <h1 className={styles.title}>{th.dev.title}</h1>
        <p className={styles.description}>{th.dev.description}</p>
      </header>

      {/* 1. Button Showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{th.dev.buttonsSection}</h2>
        <div className={styles.row}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="primary" icon={<Sparkles size={18} />}>
            With Icon
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </section>

      {/* 2. Card Showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{th.dev.cardsSection}</h2>
        <Card title="Card Title">
          นี่คือเนื้อหาตัวอย่างภายในการ์ด พื้นหลังสีขาว ขอบมน 12px
          พร้อมเงาบางเบาตาม Design Token
        </Card>
      </section>

      {/* 3. Callout Showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{th.dev.calloutsSection}</h2>
        <Callout variant="tip">
          ใช้สำหรับแนะนำเทคนิคหรือทางลัดที่เป็นประโยชน์ในการเขียนโปรแกรม
        </Callout>
        <Callout variant="warning">
          ใช้สำหรับเตือนข้อผิดพลาดที่พบบ่อย เช่น การลืมเครื่องหมายคำพูด
        </Callout>
        <Callout variant="note">
          ใช้สำหรับข้อมูลเสริมและคำอธิบายบริบทเพิ่มเติม
        </Callout>
        <Callout variant="mac">
          ใช้สำหรับแนะนำปุ่มลัดหรือการทำงานเฉพาะของระบบ macOS
        </Callout>
        <Callout variant="excel">
          ใช้สำหรับเปรียบเทียบแนวคิดกับฟังก์ชันที่คุ้นเคยใน Excel เช่น VLOOKUP
        </Callout>
      </section>

      {/* 4. Badge Showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{th.dev.badgesSection}</h2>
        <div className={styles.row}>
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      {/* 5. ProgressBar Showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{th.dev.progressSection}</h2>
        <div className={styles.section}>
          <ProgressBar
            value={25}
            label={th.common.progressLabel}
            showValue
          />
          <ProgressBar value={70} showValue />
          <ProgressBar value={100} showValue />
        </div>
      </section>

      {/* 6. Modal & Toast Showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{th.dev.modalToastSection}</h2>
        <div className={styles.row}>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            {th.common.openModal}
          </Button>
          <Button variant="secondary" onClick={() => setIsToastOpen(true)}>
            {th.common.showToast}
          </Button>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={th.common.modalTitle}
          footer={
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              {th.common.close}
            </Button>
          }
        >
          <p>{th.common.modalContent}</p>
        </Modal>
        <Toast
          isOpen={isToastOpen}
          message={th.common.toastMessage}
          type="success"
          onClose={() => setIsToastOpen(false)}
          duration={4000}
        />
      </section>

      {/* 7. Tooltip Showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{th.dev.tooltipSection}</h2>
        <div className={styles.row}>
          <Tooltip text={th.common.tooltipContent} position="top">
            <Button variant="secondary">{th.common.tooltipSample}</Button>
          </Tooltip>
        </div>
      </section>

      {/* 8. Contrast Verification Table */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{th.dev.contrastSection}</h2>
        <table className={styles.contrastTable}>
          <thead>
            <tr>
              <th>{th.dev.contrastHeaders.pair}</th>
              <th>{th.dev.contrastHeaders.sample}</th>
              <th>{th.dev.contrastHeaders.fgColor}</th>
              <th>{th.dev.contrastHeaders.bgColor}</th>
              <th>{th.dev.contrastHeaders.ratio}</th>
              <th>{th.dev.contrastHeaders.result}</th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST_PAIRS.map((pair) => {
              const ratio = getContrastRatio(pair.fg, pair.bg)
              const passes = isContrastPassing(ratio)
              return (
                <tr key={pair.name}>
                  <td>{pair.name}</td>
                  <td>
                    <span
                      className={styles.sampleCell}
                      style={{ color: pair.fg, backgroundColor: pair.bg }}
                    >
                      {th.appName}
                    </span>
                  </td>
                  <td>
                    <code>{pair.fg}</code>
                  </td>
                  <td>
                    <code>{pair.bg}</code>
                  </td>
                  <td className={styles.ratio}>{ratio.toFixed(2)}:1</td>
                  <td className={passes ? styles.pass : styles.fail}>
                    {passes ? `✓ ${th.dev.pass}` : `✗ ${th.dev.fail}`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      {/* 9. ScreenSizeGuard Note */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{th.dev.screenGuardSection}</h2>
        <p className={styles.description}>{th.dev.screenGuardNote}</p>
      </section>
    </div>
  )
}

export default DevComponentsPage

