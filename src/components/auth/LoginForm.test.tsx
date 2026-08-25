import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('calls onSubmit with the entered email and password', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<LoginForm onSubmit={onSubmit} onGoogleSignIn={vi.fn()} error={null} loading={false} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'hunter2')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(onSubmit).toHaveBeenCalledWith('test@example.com', 'hunter2', 'signin')
  })

  it('switches to sign-up mode and submits with the signup intent', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<LoginForm onSubmit={onSubmit} onGoogleSignIn={vi.fn()} error={null} loading={false} />)

    await user.click(screen.getByRole('button', { name: /need an account\? sign up/i }))
    expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/email/i), 'new@example.com')
    await user.type(screen.getByLabelText(/password/i), 'hunter2')
    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    expect(onSubmit).toHaveBeenCalledWith('new@example.com', 'hunter2', 'signup')
  })

  it('calls onGoogleSignIn when the Google button is clicked', async () => {
    const onGoogleSignIn = vi.fn()
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} onGoogleSignIn={onGoogleSignIn} error={null} loading={false} />)

    await user.click(screen.getByRole('button', { name: /google/i }))

    expect(onGoogleSignIn).toHaveBeenCalled()
  })

  it('shows the error message when provided', () => {
    render(<LoginForm onSubmit={vi.fn()} onGoogleSignIn={vi.fn()} error="Wrong password" loading={false} />)
    expect(screen.getByText('Wrong password')).toBeInTheDocument()
  })

  it('disables the submit button while loading', () => {
    render(<LoginForm onSubmit={vi.fn()} onGoogleSignIn={vi.fn()} error={null} loading={true} />)
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeDisabled()
  })
})
