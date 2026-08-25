import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { AppShell } from '../components/layout/AppShell'
import { CategoryManager } from '../components/commitments/CategoryManager'
import { CommitmentForm } from '../components/commitments/CommitmentForm'
import { ConfirmDialog } from '../components/commitments/ConfirmDialog'
import { EmptyState } from '../components/ledger/EmptyState'
import { useCategories } from '../data/categories'
import { useCommitments } from '../data/commitments'
import type { Commitment } from '../types/models'

export default function CommitmentsPage() {
  const { user } = useAuth()
  const uid = user!.uid
  const { categories, addCategory, renameCategory, deleteCategory, reorderCategories } = useCategories(uid)
  const { commitments, addCommitment, updateCommitment, deleteCommitment } = useCommitments(uid)
  const [editing, setEditing] = useState<Commitment | 'new' | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <section>
          <h2 className="font-display text-lg mb-3">Categories</h2>
          <CategoryManager
            categories={categories}
            onAdd={addCategory}
            onRename={renameCategory}
            onDelete={deleteCategory}
            onReorder={reorderCategories}
          />
        </section>

        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-display text-lg">Recurring Commitments</h2>
            {categories.length > 0 && (
              <button type="button" onClick={() => setEditing('new')} className="bg-brass text-paper px-3 py-1 rounded text-sm">
                Add commitment
              </button>
            )}
          </div>

          {categories.length === 0 ? (
            <EmptyState message="Add a category first." actionLabel="Scroll up" onAction={() => {}} />
          ) : (
            commitments.map((commitment) => (
              <div key={commitment.id} className="flex justify-between items-center py-1.5 border-t border-line first:border-t-0">
                <span>
                  {commitment.name}
                  <span className="block text-xs text-ink-soft">RM {commitment.amount.toFixed(2)}</span>
                </span>
                <span className="flex gap-3 text-sm">
                  <button type="button" onClick={() => setEditing(commitment)}>Edit</button>
                  <button type="button" onClick={() => setPendingDeleteId(commitment.id)} className="text-stamp-red">Delete</button>
                </span>
              </div>
            ))
          )}

          {editing && (
            <div className="mt-4">
              <CommitmentForm
                key={editing === 'new' ? 'new' : editing.id}
                categories={categories}
                initial={editing === 'new' ? undefined : editing}
                onCancel={() => setEditing(null)}
                onSubmit={async (input) => {
                  if (editing === 'new') await addCommitment(input)
                  else await updateCommitment(editing.id, input)
                  setEditing(null)
                }}
              />
            </div>
          )}
        </section>

        <ConfirmDialog
          open={pendingDeleteId !== null}
          message="Delete this commitment? Past months already generated won't be affected."
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={async () => {
            if (pendingDeleteId) await deleteCommitment(pendingDeleteId)
            setPendingDeleteId(null)
          }}
        />
      </div>
    </AppShell>
  )
}
