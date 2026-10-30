import { useState, useId } from 'react'
import styles from './Tooltip.module.css'

/**
 * Accessible Tooltip component triggered on hover and keyboard focus.
 *
 * @param {Object} props
 * @param {string} props.text - Tooltip text content
 * @param {'top' | 'bottom'} [props.position='top'] - Position of tooltip relative to trigger
 * @param {import('react').ReactNode} props.children - Trigger element
 * @returns {import('react').JSX.Element}
 */
export function Tooltip({ text, position = 'top', children }) {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipId = useId()

  const show = () => setIsVisible(true)
  const hide = () => setIsVisible(false)

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isVisible) {
      setIsVisible(false)
    }
  }

  const positionClass = styles[position] || styles.top
  const visibilityClass = isVisible ? styles.visible : ''

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={handleKeyDown}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}
      <span
        id={tooltipId}
        role="tooltip"
        className={`${styles.tooltip} ${positionClass} ${visibilityClass}`.trim()}
      >
        {text}
      </span>
    </span>
  )
}

export default Tooltip

