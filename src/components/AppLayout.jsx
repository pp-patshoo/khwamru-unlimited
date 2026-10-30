import { NavLink } from 'react-router-dom'
import { ScreenSizeGuard } from './ScreenSizeGuard'
import { th } from '../i18n/th'
import styles from './AppLayout.module.css'

/**
 * AppLayout component with sticky header and responsive ScreenSizeGuard.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').JSX.Element}
 */
export function AppLayout({ children }) {
  const isDev = import.meta.env.DEV

  const getNavLinkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()

  return (
    <ScreenSizeGuard>
      <div className={styles.layout}>
        <header className={styles.header}>
          <NavLink to="/" className={styles.brand}>
            {th.appName}
          </NavLink>
          <nav className={styles.nav} aria-label={th.appName}>
            <NavLink to="/courses" className={getNavLinkClass}>
              {th.nav.courses}
            </NavLink>
            <NavLink to="/glossary" className={getNavLinkClass}>
              {th.nav.glossary}
            </NavLink>
            <NavLink to="/settings" className={getNavLinkClass}>
              {th.nav.settings}
            </NavLink>
            {isDev && (
              <>
                <NavLink to="/dev/components" className={getNavLinkClass}>
                  {th.nav.devComponents}
                </NavLink>
                <NavLink to="/dev/runner" className={getNavLinkClass}>
                  {th.nav.devRunner}
                </NavLink>
              </>
            )}
          </nav>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </ScreenSizeGuard>
  )
}

export default AppLayout

