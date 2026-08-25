import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LineItemRow } from './LineItem'
import type { LineItem } from '../../types/models'

const item: LineItem = {
  id: 'c1',
  name: 'Car',
  categoryId: 'loans',
  amount: 599,
  description: 'Ambank',
  status: 'PAID',
  isOneOff: false,
}

describe('LineItemRow', () => {
  it('renders the name, description, and amount input', () => {
    render(<LineItemRow item={item} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.getByText('Car')).toBeInTheDocument()
    expect(screen.getByText('Ambank')).toBeInTheDocument()
    expect(screen.getByLabelText(/amount/i)).toHaveValue(599)
  })

  it('omits the description element when there is none', () => {
    render(<LineItemRow item={{ ...item, description: '' }} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.queryByText('Ambank')).not.toBeInTheDocument()
  })

  it('shows a one-off badge for one-off items', () => {
    render(<LineItemRow item={{ ...item, isOneOff: true }} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.getByText('one-off')).toBeInTheDocument()
  })

  it('does not show a one-off badge for template items', () => {
    render(<LineItemRow item={item} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.queryByText('one-off')).not.toBeInTheDocument()
  })

  it('calls onToggleStatus with the item id when the stamp is clicked', async () => {
    const onToggleStatus = vi.fn()
    const user = userEvent.setup()
    render(<LineItemRow item={item} onToggleStatus={onToggleStatus} onAmountChange={vi.fn()} />)
    await user.click(screen.getByText('PAID'))
    expect(onToggleStatus).toHaveBeenCalledWith('c1')
  })

  it('calls onAmountChange with the parsed value when the amount input loses focus', async () => {
    const onAmountChange = vi.fn()
    const user = userEvent.setup()
    render(<LineItemRow item={item} onToggleStatus={vi.fn()} onAmountChange={onAmountChange} />)
    const input = screen.getByLabelText(/amount/i)
    await user.clear(input)
    await user.type(input, '650')
    await user.tab()
    expect(onAmountChange).toHaveBeenCalledWith('c1', 650)
  })
})
