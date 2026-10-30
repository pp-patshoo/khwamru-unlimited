import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { th } from './i18n/th'

describe('App', () => {
  it('renders app title correctly', () => {
    render(<App />)
    const titleElement = screen.getByRole('heading', { level: 1 })
    expect(titleElement).toHaveTextContent(th.appName)
  })
})

