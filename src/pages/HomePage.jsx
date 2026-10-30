import { Link } from 'react-router-dom'
import { th } from '../i18n/th'
import { Button } from '../components/Button'

/**
 * หน้าแรก — แนะนำแอป พร้อมปุ่มเริ่มเรียน
 * @returns {import('react').JSX.Element}
 */
export function HomePage() {
  return (
    <section>
      <h1>{th.appName}</h1>
      <p>{th.welcomeDescription}</p>
      <Link to="/courses">
        <Button variant="primary">{th.pages.home.startLearning}</Button>
      </Link>
    </section>
  )
}

export default HomePage

