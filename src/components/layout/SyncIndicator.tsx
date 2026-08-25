export function SyncIndicator({ isOnline }: { isOnline: boolean }) {
  if (isOnline) return null
  return (
    <div className="bg-stamp-red text-paper text-xs text-center py-1">
      Offline — changes will sync when you're back online
    </div>
  )
}
