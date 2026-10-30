import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { DevComponentsPage } from './pages/DevComponentsPage'
import { th } from './i18n/th'

/**
 * Main application component with HashRouter.
 * @returns {import('react').JSX.Element}
 */
export function App() {
  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route
            path="/"
            element={
              <section>
                <h1>{th.appName}</h1>
                <p>{th.welcomeDescription}</p>
              </section>
            }
          />
          <Route path="/dev/components" element={<DevComponentsPage />} />
          <Route
            path="/courses"
            element={
              <section>
                <h2>{th.nav.courses}</h2>
              </section>
            }
          />
          <Route
            path="/glossary"
            element={
              <section>
                <h2>{th.nav.glossary}</h2>
              </section>
            }
          />
          <Route
            path="/settings"
            element={
              <section>
                <h2>{th.nav.settings}</h2>
              </section>
            }
          />
        </Routes>
      </AppLayout>
    </HashRouter>
  )
}

export default App
