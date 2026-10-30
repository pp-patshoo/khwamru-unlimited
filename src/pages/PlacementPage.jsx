import { useParams } from 'react-router-dom'
import { th } from '../i18n/th'

/**
 * หน้าแบบทดสอบข้ามบท — แสดง courseId จาก URL
 * @returns {import('react').JSX.Element}
 */
export function PlacementPage() {
  const { courseId } = useParams()

  return (
    <section>
      <h1>{th.pages.placement.title}</h1>
      <p>
        {th.pages.placement.courseId}: <code>{courseId}</code>
      </p>
      <p>{th.pages.placement.placeholder}</p>
    </section>
  )
}

export default PlacementPage

