import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LedgerSection } from './LedgerSection'
import type { LineItem } from '../../types/models'

const items: LineItem[] = [
  { id: 'c1', name: 'Car', categoryId: 'loans', amount: 599, description: 'Ambank', status: 'PAID', isOneOff: false },
  { id: 'c2', name: 'Kajang House', categoryId: 'loans', amount: 1151, description: 'RHB Bank', status: 'PAID', isOneOff: false },
]

describe('LedgerSection', () => {
  it('renders the category name, subtotal, and each item', () => {
    render(<LedgerSection categoryName="Bank Loans" items={items} subtotal={1750} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.getByText('Bank Loans')).toBeInTheDocument()
    expect(screen.getByText('RM 1750.00')).toBeInTheDocument()
    expect(screen.getByText('Car')).toBeInTheDocument()
    expect(screen.getByText('Kajang House')).toBeInTheDocument()
  })

  it('renders nothing for items when the list is empty', () => {
    render(<LedgerSection categoryName="Bills" items={[]} subtotal={0} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.getByText('Bills')).toBeInTheDocument()
    expect(screen.getByText('RM 0.00')).toBeInTheDocument()
  })
})
