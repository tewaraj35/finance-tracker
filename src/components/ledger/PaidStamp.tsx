import type { ItemStatus } from '../../types/models'

export interface PaidStampProps {
  status: ItemStatus
  onClick?: () => void
}

export function PaidStamp({ status, onClick }: PaidStampProps) {
  const isPaid = status === 'PAID'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-mono text-[10px] font-semibold tracking-wide rounded px-2 py-0.5 -rotate-6 ${
        isPaid ? 'border-2 border-paid text-paid' : 'border-2 border-dashed border-stamp-red text-stamp-red'
      }`}
    >
      {status}
    </button>
  )
}
