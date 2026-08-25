import type { LineItem } from '../../types/models'
import { PaidStamp } from './PaidStamp'

export interface LineItemRowProps {
  item: LineItem
  onToggleStatus: (itemId: string) => void
  onAmountChange: (itemId: string, amount: number) => void
}

export function LineItemRow({ item, onToggleStatus, onAmountChange }: LineItemRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-t border-dashed border-line first:border-t-0">
      <span className="text-sm">
        {item.name}
        {item.isOneOff && <span className="text-[10px] text-brass ml-1.5 align-middle">one-off</span>}
        {item.description && <span className="block text-xs text-ink-soft">{item.description}</span>}
      </span>
      <span className="flex items-center gap-2.5">
        <span className="font-mono text-sm text-ink-soft">RM</span>
        <label>
          <span className="sr-only">Amount</span>
          <input
            aria-label="Amount"
            type="number"
            step="0.01"
            defaultValue={item.amount}
            onBlur={(event) => {
              const amount = Number(event.target.value)
              if (Number.isFinite(amount)) onAmountChange(item.id, amount)
            }}
            className="font-mono text-sm w-20 text-right bg-transparent border-b border-transparent focus:border-line focus-visible:ring-2 focus-visible:ring-brass"
          />
        </label>
        <PaidStamp status={item.status} onClick={() => onToggleStatus(item.id)} />
      </span>
    </div>
  )
}
