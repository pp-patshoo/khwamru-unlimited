import { th } from '../i18n/th'

/**
 * หน้าเลือกคอร์ส
 * @returns {import('react').JSX.Element}
 */
export function CoursesPage() {
  return (
    <section>
      <h1>{th.pages.courses.title}</h1>
      <p>{th.pages.courses.placeholder}</p>
    </section>
  )
}

export default CoursesPage

