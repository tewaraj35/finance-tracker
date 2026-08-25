import type { Commitment, LineItem } from '../types/models'

export function getMonthId(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function cloneCommitmentsToItems(commitments: Commitment[]): LineItem[] {
  return commitments
    .filter((commitment) => commitment.active)
    .map((commitment) => ({
      id: commitment.id,
      name: commitment.name,
      categoryId: commitment.categoryId,
      amount: commitment.amount,
      description: commitment.description,
      status: 'PENDING',
      isOneOff: false,
    }))
}

export function computeTotalCommitted(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0)
}

export function computeRemainingBalance(salary: number, items: LineItem[]): number {
  return salary - computeTotalCommitted(items)
}

export function computeCategorySubtotals(items: LineItem[]): Record<string, number> {
  const subtotals: Record<string, number> = {}
  for (const item of items) {
    subtotals[item.categoryId] = (subtotals[item.categoryId] ?? 0) + item.amount
  }
  return subtotals
}

export function computePaidPendingTotals(items: LineItem[]): { paid: number; pending: number } {
  return items.reduce(
    (totals, item) => {
      if (item.status === 'PAID') totals.paid += item.amount
      else totals.pending += item.amount
      return totals
    },
    { paid: 0, pending: 0 },
  )
}

export function computePaidRatio(items: LineItem[]): number {
  const total = computeTotalCommitted(items)
  if (total === 0) return 0
  const { paid } = computePaidPendingTotals(items)
  return paid / total
}
