import { useParams } from 'react-router-dom'
import { th } from '../i18n/th'

/**
 * หน้าภาพรวมคอร์ส — แสดง courseId จาก URL
 * @returns {import('react').JSX.Element}
 */
export function CourseDetailPage() {
  const { courseId } = useParams()

  return (
    <section>
      <h1>{th.pages.courseDetail.title}</h1>
      <p>
        {th.pages.courseDetail.courseId}: <code>{courseId}</code>
      </p>
      <p>{th.pages.courseDetail.placeholder}</p>
    </section>
  )
}

export default CourseDetailPage

