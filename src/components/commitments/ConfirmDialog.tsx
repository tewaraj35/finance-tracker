export interface ConfirmDialogProps {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50">
      <div className="bg-paper border border-line rounded p-6 max-w-sm w-full">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="bg-stamp-red text-paper px-3 py-1.5 rounded text-sm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
