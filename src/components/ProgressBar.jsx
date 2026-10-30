import styles from './ProgressBar.module.css'

/**
 * Accessible progress bar component.
 *
 * @param {Object} props
 * @param {number} props.value - Current progress value (e.g. 0 to 100)
 * @param {number} [props.max=100] - Maximum progress value
 * @param {string} [props.label] - Accessible label and optional visible header
 * @param {boolean} [props.showValue=false] - Whether to show percentage text
 * @param {string} [props.className] - Additional CSS class
 * @returns {import('react').JSX.Element}
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  className = '',
  ...rest
}) {
  const safeValue = Math.min(Math.max(value, 0), max)
  const percentage = Math.round((safeValue / max) * 100)

  return (
    <div className={`${styles.wrapper} ${className}`.trim()} {...rest}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && <span className={styles.percentage}>{percentage}%</span>}
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar

