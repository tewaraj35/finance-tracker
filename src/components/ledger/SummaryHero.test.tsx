import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SummaryHero } from './SummaryHero'
import type { LineItem } from '../../types/models'

const items: LineItem[] = [
  { id: 'c1', name: 'Car', categoryId: 'loans', amount: 599, description: '', status: 'PAID', isOneOff: false },
  { id: 'c2', name: 'PTPTN', categoryId: 'loans', amount: 251.83, description: '', status: 'PENDING', isOneOff: false },
]

describe('SummaryHero', () => {
  it('renders salary, committed total, and remaining balance', () => {
    render(<SummaryHero salary={6500} items={items} />)
    expect(screen.getByText('RM 6500.00')).toBeInTheDocument()
    expect(screen.getByText('RM 850.83')).toBeInTheDocument()
    expect(screen.getByText('RM 5649.17')).toBeInTheDocument()
  })

  it('sets the progress bar width to the paid ratio', () => {
    render(<SummaryHero salary={6500} items={items} />)
    const bar = screen.getByTestId('paid-progress-fill')
    expect(bar).toHaveStyle({ width: `${(599 / 850.83) * 100}%` })
  })
})
