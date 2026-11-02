import { th } from '../../i18n/th'
import styles from './OutputPanel.module.css'

/**
 * แสดงผลการรัน: stdout, stderr, ค่าบรรทัดสุดท้าย, กราฟ, ตาราง, error และข้อความแจ้งเตือน
 *
 * @param {object} props
 * @param {object} props.output - ผลที่รวบรวมจากการรัน
 * @param {string} props.output.stdout
 * @param {string} props.output.stderr
 * @param {string | null} props.output.result
 * @param {object | null} props.output.error - { type, message, line, traceback }
 * @param {string | null} props.output.notice - ข้อความแจ้งเตือน เช่น หยุดเอง
 * @param {string[]} props.output.images - รูป PNG เป็น data URL
 * @param {{ columns: string[], rows: any[][], totalRows: number } | null} props.output.table
 * @param {boolean} props.isRunning
 * @returns {import('react').JSX.Element}
 */
export function OutputPanel({ output, isRunning }) {
  const hasContent =
    output.stdout ||
    output.stderr ||
    output.result !== null ||
    output.error ||
    output.images.length > 0 ||
    output.table

  return (
    <section className={styles.panel} aria-live="polite">
      <h2 className={styles.title}>{th.playground.outputTitle}</h2>

      {isRunning && <p className={styles.running}>{th.playground.runningLabel}</p>}

      {output.notice && (
        <p className={styles.notice} role="status">
          {output.notice}
        </p>
      )}

      {!isRunning && !hasContent && !output.notice && (
        <p className={styles.empty}>{th.playground.emptyOutput}</p>
      )}

      {output.stdout && (
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{th.playground.stdoutLabel}</h3>
          <pre className={styles.pre}>{output.stdout}</pre>
        </div>
      )}

      {output.stderr && (
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{th.playground.stderrLabel}</h3>
          <pre className={styles.pre}>{output.stderr}</pre>
        </div>
      )}

      {output.result !== null && (
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{th.playground.resultLabel}</h3>
          <pre className={`${styles.pre} ${styles.result}`}>{output.result}</pre>
        </div>
      )}

      {output.images.map((src, index) => (
        <img key={index} className={styles.image} src={src} alt={th.playground.imageAlt} />
      ))}

      {output.table && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {output.table.columns.map((column, index) => (
                  <th key={index} scope="col">
                    {String(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {output.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{String(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.caption}>
            {th.playground.tableCaption(output.table.rows.length, output.table.totalRows)}
          </p>
        </div>
      )}

      {output.error && (
        <div className={styles.errorBox}>
          <div className={styles.errorTitle}>{th.playground.errorLabel}</div>
          <div className={styles.errorField}>
            <strong>{th.playground.errorType}</strong> {output.error.type}
          </div>
          <div className={styles.errorField}>
            <strong>{th.playground.errorLine}</strong>{' '}
            {output.error.line !== null ? output.error.line : '-'}
          </div>
          <div className={styles.errorField}>
            <strong>{th.playground.errorMessage}</strong> {output.error.message}
          </div>
          {output.error.traceback && (
            <div>
              <strong className={styles.errorField}>{th.playground.tracebackLabel}</strong>
              <pre className={styles.tracebackPre}>{output.error.traceback}</pre>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default OutputPanel
