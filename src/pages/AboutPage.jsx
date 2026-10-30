import { th } from '../i18n/th'

/**
 * หน้าเกี่ยวกับ
 * @returns {import('react').JSX.Element}
 */
export function AboutPage() {
  return (
    <section>
      <h1>{th.pages.about.title}</h1>
      <p>{th.pages.about.placeholder}</p>
    </section>
  )
}

export default AboutPage

