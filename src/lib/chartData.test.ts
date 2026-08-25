import { describe, expect, it } from 'vitest'
import { buildCategoryBreakdownData, buildMonthTrendData } from './chartData'
import type { Category, LineItem, MonthDoc } from '../types/models'

const categories: Category[] = [
  { id: 'loans', name: 'Bank Loans', sortOrder: 0 },
  { id: 'bills', name: 'Bills', sortOrder: 1 },
]

const items: LineItem[] = [
  { id: 'c1', name: 'Car', categoryId: 'loans', amount: 599, description: '', status: 'PAID', isOneOff: false },
  { id: 'c2', name: 'Electricity', categoryId: 'bills', amount: 142.85, description: '', status: 'PAID', isOneOff: false },
]

describe('buildCategoryBreakdownData', () => {
  it('maps category ids to names with summed amounts', () => {
    expect(buildCategoryBreakdownData(items, categories)).toEqual([
      { name: 'Bank Loans', value: 599 },
      { name: 'Bills', value: 142.85 },
    ])
  })

  it('skips categories with no items', () => {
    expect(buildCategoryBreakdownData([items[0]], categories)).toEqual([{ name: 'Bank Loans', value: 599 }])
  })
})

describe('buildMonthTrendData', () => {
  it('computes salary, committed, and remaining per month, sorted by month id', () => {
    const months: MonthDoc[] = [
      { id: '2026-08', salary: 6500, items },
      { id: '2026-06', salary: 6000, items: [items[0]] },
    ]
    expect(buildMonthTrendData(months)).toEqual([
      { month: '2026-06', salary: 6000, committed: 599, remaining: 5401 },
      { month: '2026-08', salary: 6500, committed: 741.85, remaining: 5758.15 },
    ])
  })
})
