import {
  Lightbulb,
  AlertTriangle,
  Info,
  Command,
  FileSpreadsheet,
} from 'lucide-react'
import { th } from '../i18n/th'
import styles from './Callout.module.css'

const CALLOUT_ICONS = {
  tip: Lightbulb,
  warning: AlertTriangle,
  note: Info,
  mac: Command,
  excel: FileSpreadsheet,
}

/**
 * Callout box for tips, warnings, notes, mac tips, and excel comparisons.
 *
 * @param {Object} props
 * @param {'tip' | 'warning' | 'note' | 'mac' | 'excel'} [props.variant='note'] - Callout variant
 * @param {string} [props.title] - Optional override title
 * @param {import('react').ReactNode} props.children - Content
 * @param {string} [props.className] - Additional CSS class
 * @returns {import('react').JSX.Element}
 */
export function Callout({
  variant = 'note',
  title,
  children,
  className = '',
  ...rest
}) {
  const IconComponent = CALLOUT_ICONS[variant] || CALLOUT_ICONS.note
  const variantClass = styles[variant] || styles.note
  const displayTitle = title ?? th.callout[variant] ?? ''

  return (
    <aside
      className={`${styles.callout} ${variantClass} ${className}`.trim()}
      aria-label={displayTitle}
      {...rest}
    >
      <div className={styles.iconWrapper} aria-hidden="true">
        <IconComponent size={20} />
      </div>
      <div className={styles.body}>
        {displayTitle && <div className={styles.title}>{displayTitle}</div>}
        <div className={styles.content}>{children}</div>
      </div>
    </aside>
  )
}

export default Callout

