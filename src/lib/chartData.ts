import { computeCategorySubtotals, computeRemainingBalance, computeTotalCommitted } from './ledgerCalculations'
import type { Category, LineItem, MonthDoc } from '../types/models'

export function buildCategoryBreakdownData(items: LineItem[], categories: Category[]) {
  const subtotals = computeCategorySubtotals(items)
  return categories
    .filter((category) => subtotals[category.id] !== undefined)
    .map((category) => ({ name: category.name, value: subtotals[category.id] }))
}

export function buildMonthTrendData(months: MonthDoc[]) {
  return [...months]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((month) => ({
      month: month.id,
      salary: month.salary,
      committed: computeTotalCommitted(month.items),
      remaining: computeRemainingBalance(month.salary, month.items),
    }))
}
