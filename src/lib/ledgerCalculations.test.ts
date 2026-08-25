import { describe, expect, it } from 'vitest'
import {
  cloneCommitmentsToItems,
  computeCategorySubtotals,
  computePaidPendingTotals,
  computePaidRatio,
  computeRemainingBalance,
  computeTotalCommitted,
  getMonthId,
} from './ledgerCalculations'
import type { Commitment, LineItem } from '../types/models'

const commitments: Commitment[] = [
  { id: 'c1', name: 'Car', categoryId: 'loans', amount: 599, description: 'Ambank', active: true },
  { id: 'c2', name: 'Electricity', categoryId: 'bills', amount: 142.85, description: '', active: true },
  { id: 'c3', name: 'Inactive', categoryId: 'bills', amount: 50, description: '', active: false },
]

const items: LineItem[] = [
  { id: 'c1', name: 'Car', categoryId: 'loans', amount: 599, description: 'Ambank', status: 'PAID', isOneOff: false },
  { id: 'c2', name: 'Electricity', categoryId: 'bills', amount: 142.85, description: '', status: 'PENDING', isOneOff: false },
  { id: 'x1', name: 'Surprise repair', categoryId: 'bills', amount: 100, description: '', status: 'PENDING', isOneOff: true },
]

describe('getMonthId', () => {
  it('formats a date as YYYY-MM', () => {
    expect(getMonthId(new Date(2026, 7, 25))).toBe('2026-08')
  })

  it('pads single-digit months', () => {
    expect(getMonthId(new Date(2026, 0, 1))).toBe('2026-01')
  })
})

describe('cloneCommitmentsToItems', () => {
  it('clones only active commitments as PENDING, non-one-off items', () => {
    const result = cloneCommitmentsToItems(commitments)
    expect(result).toHaveLength(2)
    expect(result.every((item) => item.status === 'PENDING')).toBe(true)
    expect(result.every((item) => item.isOneOff === false)).toBe(true)
    expect(result.map((item) => item.id)).toEqual(['c1', 'c2'])
  })
})

describe('computeTotalCommitted', () => {
  it('sums all item amounts', () => {
    expect(computeTotalCommitted(items)).toBeCloseTo(841.85)
  })

  it('returns 0 for an empty list', () => {
    expect(computeTotalCommitted([])).toBe(0)
  })
})

describe('computeRemainingBalance', () => {
  it('subtracts total committed from salary', () => {
    expect(computeRemainingBalance(6500, items)).toBeCloseTo(6500 - 841.85)
  })
})

describe('computeCategorySubtotals', () => {
  it('groups amounts by categoryId', () => {
    expect(computeCategorySubtotals(items)).toEqual({
      loans: 599,
      bills: 242.85,
    })
  })
})

describe('computePaidPendingTotals', () => {
  it('splits totals by status', () => {
    expect(computePaidPendingTotals(items)).toEqual({ paid: 599, pending: 242.85 })
  })
})

describe('computePaidRatio', () => {
  it('returns the paid fraction of the total committed', () => {
    expect(computePaidRatio(items)).toBeCloseTo(599 / 841.85)
  })

  it('returns 0 when there are no items', () => {
    expect(computePaidRatio([])).toBe(0)
  })
})
