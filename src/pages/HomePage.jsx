import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { th } from '../i18n/th'
import { Button } from '../components/Button'
import { initRunner } from '../features/runner/runnerClient'

/**
 * หน้าแรก — แนะนำแอป พร้อมปุ่มเริ่มเรียน
 * @returns {import('react').JSX.Element}
 */
export function HomePage() {
  useEffect(() => {
    // เริ่มโหลด Pyodide ในเบื้องหลังหลังจากหน้าแรกแสดงผล (SPEC หัวข้อ 6, PLAN T1.1)
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      initRunner().catch((err) => {
        console.warn('Background Pyodide init failed:', err)
      })
    }
  }, [])

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
