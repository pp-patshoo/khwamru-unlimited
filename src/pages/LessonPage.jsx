import { useParams } from 'react-router-dom'
import { th } from '../i18n/th'

/**
 * หน้าเรียน — แสดง courseId และ lessonId จาก URL
 * @returns {import('react').JSX.Element}
 */
export function LessonPage() {
  const { courseId, lessonId } = useParams()

  return (
    <section>
      <h1>{th.pages.lesson.title}</h1>
      <p>
        {th.pages.lesson.courseId}: <code>{courseId}</code>
      </p>
      <p>
        {th.pages.lesson.lessonId}: <code>{lessonId}</code>
      </p>
      <p>{th.pages.lesson.placeholder}</p>
    </section>
  )
}

export default LessonPage

