import { th } from '../i18n/th'

/**
 * หน้าคำศัพท์
 * @returns {import('react').JSX.Element}
 */
export function GlossaryPage() {
  return (
    <section>
      <h1>{th.pages.glossary.title}</h1>
      <p>{th.pages.glossary.placeholder}</p>
    </section>
  )
}

export default GlossaryPage

