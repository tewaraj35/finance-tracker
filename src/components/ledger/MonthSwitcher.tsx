const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export interface MonthSwitcherProps {
  monthId: string
  onChange: (monthId: string) => void
}

function shiftMonth(monthId: string, delta: number): string {
  const [year, month] = monthId.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function MonthSwitcher({ monthId, onChange }: MonthSwitcherProps) {
  const [year, month] = monthId.split('-').map(Number)
  const label = `${MONTH_LABELS[month - 1]} ${year}`

  return (
    <div className="flex items-center gap-3">
      <button type="button" aria-label="Previous month" onClick={() => onChange(shiftMonth(monthId, -1))}>
        ←
      </button>
      <span className="font-mono text-sm min-w-[9ch] text-center">{label}</span>
      <button type="button" aria-label="Next month" onClick={() => onChange(shiftMonth(monthId, 1))}>
        →
      </button>
    </div>
  )
}
