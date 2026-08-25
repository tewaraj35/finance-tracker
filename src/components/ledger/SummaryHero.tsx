import { computePaidRatio, computeRemainingBalance, computeTotalCommitted } from '../../lib/ledgerCalculations'
import type { LineItem } from '../../types/models'

export interface SummaryHeroProps {
  salary: number
  items: LineItem[]
}

function formatCurrency(amount: number): string {
  return `RM ${amount.toFixed(2)}`
}

export function SummaryHero({ salary, items }: SummaryHeroProps) {
  const committed = computeTotalCommitted(items)
  const remaining = computeRemainingBalance(salary, items)
  const paidRatio = computePaidRatio(items)

  return (
    <div className="pb-4 border-b border-line">
      <div className="flex justify-between items-baseline py-1">
        <span className="text-xs uppercase tracking-wide text-ink-soft">Salary</span>
        <span className="font-mono text-sm">{formatCurrency(salary)}</span>
      </div>
      <div className="flex justify-between items-baseline py-1">
        <span className="text-xs uppercase tracking-wide text-ink-soft">Committed</span>
        <span className="font-mono text-sm">{formatCurrency(committed)}</span>
      </div>
      <div className="flex justify-between items-baseline py-1">
        <span className="text-sm uppercase tracking-wide text-ink-soft">Remaining</span>
        <span className="font-display text-3xl font-semibold text-paid">{formatCurrency(remaining)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-line mt-2.5 overflow-hidden">
        <div
          data-testid="paid-progress-fill"
          className="h-full bg-brass"
          style={{ width: `${paidRatio * 100}%` }}
        />
      </div>
    </div>
  )
}
