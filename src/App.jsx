import { th } from './i18n/th'

/**
 * App component
 * @returns {import('react').JSX.Element}
 */
export function App() {
  return (
    <main>
      <h1>{th.appName}</h1>
      <p>{th.welcomeDescription}</p>
    </main>
  )
}

export default App

