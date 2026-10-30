import { useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { th } from '../i18n/th'
import styles from './Toast.module.css'

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

/**
 * Accessible Toast notification component.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the toast is visible
 * @param {string} props.message - Notification message
 * @param {'info' | 'success' | 'error'} [props.type='info'] - Toast category
 * @param {() => void} props.onClose - Dismiss callback
 * @param {number} [props.duration=0] - Auto dismiss duration in milliseconds (0 = manual dismiss only)
 * @returns {import('react').JSX.Element | null}
 */
export function Toast({
  isOpen,
  message,
  type = 'info',
  onClose,
  duration = 0,
}) {
  useEffect(() => {
    if (!isOpen || duration <= 0) return

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  const IconComponent = TOAST_ICONS[type] || TOAST_ICONS.info
  const role = type === 'error' ? 'alert' : 'status'

  return (
    <div
      role={role}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`${styles.container} ${styles[type] || styles.info}`}
    >
      <span className={styles.icon} aria-hidden="true">
        <IconComponent size={20} />
      </span>
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label={th.common.close}
      >
        <X size={18} />
      </button>
    </div>
  )
}

export default Toast

