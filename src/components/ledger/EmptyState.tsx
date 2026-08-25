export interface EmptyStateProps {
  message: string
  actionLabel: string
  onAction: () => void
}

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center text-ink-soft">
      <p>{message}</p>
      <button type="button" onClick={onAction} className="bg-brass text-paper px-4 py-2 rounded font-medium">
        {actionLabel}
      </button>
    </div>
  )
}
