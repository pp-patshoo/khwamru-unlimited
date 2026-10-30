import styles from './Button.module.css'

/**
 * Reusable Button component supporting primary, secondary, and ghost variants.
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'ghost'} [props.variant='primary'] - Button style variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {import('react').ReactNode} [props.icon] - Optional leading icon
 * @param {import('react').ReactNode} [props.children] - Button text or content
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - HTML button type
 * @param {() => void} [props.onClick] - Click event handler
 * @param {string} [props.ariaLabel] - Accessible label for icon-only buttons
 * @param {string} [props.className] - Additional CSS class
 * @returns {import('react').JSX.Element}
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  disabled = false,
  type = 'button',
  onClick,
  ariaLabel,
  className = '',
  ...rest
}) {
  const variantClass = styles[variant] || styles.primary
  const sizeClass = styles[size] || styles.md
  const combinedClassName = `${styles.button} ${variantClass} ${sizeClass} ${className}`.trim()

  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      {...rest}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}

export default Button

