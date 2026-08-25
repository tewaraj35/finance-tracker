import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MonthSwitcher } from './MonthSwitcher'

describe('MonthSwitcher', () => {
  it('renders the current month label', () => {
    render(<MonthSwitcher monthId="2026-08" onChange={vi.fn()} />)
    expect(screen.getByText('August 2026')).toBeInTheDocument()
  })

  it('calls onChange with the previous month when the back arrow is clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<MonthSwitcher monthId="2026-08" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /previous month/i }))
    expect(onChange).toHaveBeenCalledWith('2026-07')
  })

  it('calls onChange with the next month when the forward arrow is clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<MonthSwitcher monthId="2026-08" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /next month/i }))
    expect(onChange).toHaveBeenCalledWith('2026-09')
  })

  it('handles crossing a year boundary', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<MonthSwitcher monthId="2026-01" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /previous month/i }))
    expect(onChange).toHaveBeenCalledWith('2025-12')
  })
})
