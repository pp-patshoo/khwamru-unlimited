import styles from './Card.module.css'

/**
 * Reusable Card component with 12px rounded corners and subtle shadow.
 *
 * @param {Object} props
 * @param {string} [props.title] - Optional card heading
 * @param {import('react').ReactNode} props.children - Card contents
 * @param {string} [props.className] - Additional custom CSS class
 * @param {keyof HTMLElementTagNameMap} [props.as='div'] - Semantic HTML tag
 * @returns {import('react').JSX.Element}
 */
export function Card({
  title,
  children,
  className = '',
  as: Component = 'div',
  ...rest
}) {
  return (
    <Component className={`${styles.card} ${className}`.trim()} {...rest}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.content}>{children}</div>
    </Component>
  )
}

export default Card

