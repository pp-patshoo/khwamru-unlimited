import { th } from '../i18n/th'

/**
 * หน้าตั้งค่า
 * @returns {import('react').JSX.Element}
 */
export function SettingsPage() {
  return (
    <section>
      <h1>{th.pages.settings.title}</h1>
      <p>{th.pages.settings.placeholder}</p>
    </section>
  )
}

export default SettingsPage

