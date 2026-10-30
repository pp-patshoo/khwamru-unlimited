import { Monitor } from 'lucide-react'
import { th } from '../i18n/th'
import styles from './ScreenSizeGuard.module.css'

/**
 * ScreenSizeGuard ensures the app is viewed on screens >= 1024px.
 * On smaller screens, it displays a friendly notice as per SPEC section 4.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').JSX.Element}
 */
export function ScreenSizeGuard({ children }) {
  return (
    <>
      <div className={styles.guardBanner} role="alert">
        <div className={styles.iconWrapper} aria-hidden="true">
          <Monitor size={56} />
        </div>
        <h2 className={styles.title}>{th.screenSizeGuard.title}</h2>
        <p className={styles.message}>{th.screenSizeGuard.message}</p>
      </div>
      <div className={styles.content}>{children}</div>
    </>
  )
}

export default ScreenSizeGuard
