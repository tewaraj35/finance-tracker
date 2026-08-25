import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CategoryManager } from './CategoryManager'
import type { Category } from '../../types/models'

const categories: Category[] = [
  { id: 'cat1', name: 'Bank Loans', sortOrder: 0 },
  { id: 'cat2', name: 'Bills', sortOrder: 1 },
]

describe('CategoryManager', () => {
  it('renders each category name', () => {
    render(<CategoryManager categories={categories} onAdd={vi.fn()} onRename={vi.fn()} onDelete={vi.fn()} onReorder={vi.fn()} />)
    expect(screen.getByDisplayValue('Bank Loans')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Bills')).toBeInTheDocument()
  })

  it('calls onAdd with the typed name when the add form is submitted', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<CategoryManager categories={categories} onAdd={onAdd} onRename={vi.fn()} onDelete={vi.fn()} onReorder={vi.fn()} />)
    await user.type(screen.getByLabelText(/new category/i), 'Insurances')
    await user.click(screen.getByRole('button', { name: /add category/i }))
    expect(onAdd).toHaveBeenCalledWith('Insurances')
  })

  it('calls onDelete with the category id when its delete button is clicked', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<CategoryManager categories={categories} onAdd={vi.fn()} onRename={vi.fn()} onDelete={onDelete} onReorder={vi.fn()} />)
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0])
    expect(onDelete).toHaveBeenCalledWith('cat1')
  })

  it('calls onReorder with the swapped id order when moving a category down', async () => {
    const onReorder = vi.fn()
    const user = userEvent.setup()
    render(<CategoryManager categories={categories} onAdd={vi.fn()} onRename={vi.fn()} onDelete={vi.fn()} onReorder={onReorder} />)
    await user.click(screen.getAllByRole('button', { name: /move down/i })[0])
    expect(onReorder).toHaveBeenCalledWith(['cat2', 'cat1'])
  })

  it('disables moving the first category up and the last category down', () => {
    render(<CategoryManager categories={categories} onAdd={vi.fn()} onRename={vi.fn()} onDelete={vi.fn()} onReorder={vi.fn()} />)
    const upButtons = screen.getAllByRole('button', { name: /move up/i })
    const downButtons = screen.getAllByRole('button', { name: /move down/i })
    expect(upButtons[0]).toBeDisabled()
    expect(downButtons[downButtons.length - 1]).toBeDisabled()
  })
})
