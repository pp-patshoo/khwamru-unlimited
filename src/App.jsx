import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { HomePage } from './pages/HomePage'
import { CoursesPage } from './pages/CoursesPage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { LessonPage } from './pages/LessonPage'
import { GlossaryPage } from './pages/GlossaryPage'
import { PlacementPage } from './pages/PlacementPage'
import { SettingsPage } from './pages/SettingsPage'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { DevComponentsPage } from './pages/DevComponentsPage'
import { DevRunnerPage } from './pages/DevRunnerPage'

/**
 * Main application component with HashRouter.
 * Route ทั้งหมดตาม SPEC หัวข้อ 4
 * @returns {import('react').JSX.Element}
 */
export function App() {
  const isDev = import.meta.env.DEV

  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/learn/:courseId/:lessonId" element={<LessonPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/placement/:courseId" element={<PlacementPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          {isDev && (
            <>
              <Route path="/dev/components" element={<DevComponentsPage />} />
              <Route path="/dev/runner" element={<DevRunnerPage />} />
            </>
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  )
}

export default App
