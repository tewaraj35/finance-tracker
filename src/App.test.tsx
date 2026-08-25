import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('redirects unauthenticated users to the login page', async () => {
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Finance Ledger' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
  })
})
