import type { LineItem } from '../../types/models'
import { LineItemRow } from './LineItem'

export interface LedgerSectionProps {
  categoryName: string
  items: LineItem[]
  subtotal: number
  onToggleStatus: (itemId: string) => void
  onAmountChange: (itemId: string, amount: number) => void
}

export function LedgerSection({ categoryName, items, subtotal, onToggleStatus, onAmountChange }: LedgerSectionProps) {
  return (
    <section className="py-3.5 border-t border-line first:border-t-0">
      <div className="flex justify-between font-display font-semibold text-sm uppercase tracking-wide text-ink-soft mb-1.5">
        <span>{categoryName}</span>
        <span className="font-mono normal-case tracking-normal">RM {subtotal.toFixed(2)}</span>
      </div>
      {items.map((item) => (
        <LineItemRow key={item.id} item={item} onToggleStatus={onToggleStatus} onAmountChange={onAmountChange} />
      ))}
    </section>
  )
}
