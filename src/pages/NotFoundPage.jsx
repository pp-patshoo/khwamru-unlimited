import { Link } from 'react-router-dom'
import { th } from '../i18n/th'
import { Button } from '../components/Button'

/**
 * หน้า 404 — แสดงเมื่อเข้า URL ที่ไม่มีอยู่
 * @returns {import('react').JSX.Element}
 */
export function NotFoundPage() {
  return (
    <section>
      <h1>{th.pages.notFound.title}</h1>
      <p>{th.pages.notFound.message}</p>
      <Link to="/">
        <Button variant="primary">{th.pages.notFound.backHome}</Button>
      </Link>
    </section>
  )
}

export default NotFoundPage

