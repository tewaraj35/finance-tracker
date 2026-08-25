import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CommitmentForm } from './CommitmentForm'
import type { Category } from '../../types/models'

const categories: Category[] = [{ id: 'cat1', name: 'Bank Loans', sortOrder: 0 }]

describe('CommitmentForm', () => {
  it('submits the entered values', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<CommitmentForm categories={categories} onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText(/name/i), 'Car')
    await user.type(screen.getByLabelText(/amount/i), '599')
    await user.selectOptions(screen.getByLabelText(/category/i), 'cat1')
    await user.type(screen.getByLabelText(/description/i), 'Ambank')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Car',
      amount: 599,
      categoryId: 'cat1',
      description: 'Ambank',
      active: true,
    })
  })

  it('calls onCancel when cancel is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<CommitmentForm categories={categories} onSubmit={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })
})
