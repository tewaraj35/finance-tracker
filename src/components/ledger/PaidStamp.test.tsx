import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PaidStamp } from './PaidStamp'

describe('PaidStamp', () => {
  it('renders PAID text and styling for a paid item', () => {
    render(<PaidStamp status="PAID" />)
    const stamp = screen.getByText('PAID')
    expect(stamp).toBeInTheDocument()
    expect(stamp).toHaveClass('border-paid')
  })

  it('renders PENDING text and styling for a pending item', () => {
    render(<PaidStamp status="PENDING" />)
    const stamp = screen.getByText('PENDING')
    expect(stamp).toBeInTheDocument()
    expect(stamp).toHaveClass('border-stamp-red')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<PaidStamp status="PENDING" onClick={onClick} />)
    await user.click(screen.getByText('PENDING'))
    expect(onClick).toHaveBeenCalled()
  })
})
