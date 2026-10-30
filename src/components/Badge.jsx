import styles from './Badge.module.css'

/**
 * Small status badge component.
 *
 * @param {Object} props
 * @param {'default' | 'success' | 'warning' | 'error' | 'info'} [props.variant='default'] - Badge style variant
 * @param {import('react').ReactNode} props.children - Badge label
 * @param {string} [props.className] - Additional CSS class
 * @returns {import('react').JSX.Element}
 */
export function Badge({
  variant = 'default',
  children,
  className = '',
  ...rest
}) {
  const variantClass = styles[variant] || styles.default

  return (
    <span
      className={`${styles.badge} ${variantClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  )
}

export default Badge

