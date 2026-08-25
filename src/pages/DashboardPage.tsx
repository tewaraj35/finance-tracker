import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { AppShell } from '../components/layout/AppShell'
import { EmptyState } from '../components/ledger/EmptyState'
import { LedgerSection } from '../components/ledger/LedgerSection'
import { MonthSwitcher } from '../components/ledger/MonthSwitcher'
import { SummaryHero } from '../components/ledger/SummaryHero'
import { useCategories } from '../data/categories'
import { useCommitments } from '../data/commitments'
import { useMonth } from '../data/months'
import { computeCategorySubtotals, getMonthId } from '../lib/ledgerCalculations'

export default function DashboardPage() {
  const { user } = useAuth()
  const uid = user!.uid
  const navigate = useNavigate()
  const [monthId, setMonthId] = useState(() => getMonthId(new Date()))
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemAmount, setNewItemAmount] = useState('')
  const [newItemCategoryId, setNewItemCategoryId] = useState('')
  const [newItemDescription, setNewItemDescription] = useState('')

  const { categories, loading: categoriesLoading } = useCategories(uid)
  const { commitments, loading: commitmentsLoading } = useCommitments(uid)
  const {
    month,
    loading: monthLoading,
    setSalary,
    toggleItemStatus,
    updateItemAmount,
    addOneOffItem,
  } = useMonth(uid, monthId, commitments)

  if (categoriesLoading || commitmentsLoading || monthLoading) {
    return (
      <AppShell>
        <p className="text-ink-soft">Loading…</p>
      </AppShell>
    )
  }

  if (categories.length === 0 || commitments.length === 0) {
    return (
      <AppShell>
        <EmptyState
          message="Add your first category and commitment to start tracking this month."
          actionLabel="Go to commitments"
          onAction={() => navigate('/commitments')}
        />
      </AppShell>
    )
  }

  const items = month?.items ?? []
  const subtotals = computeCategorySubtotals(items)

  async function handleAddOneOff(event: FormEvent) {
    event.preventDefault()
    await addOneOffItem({
      name: newItemName,
      amount: Number(newItemAmount),
      categoryId: newItemCategoryId || categories[0].id,
      description: newItemDescription,
    })
    setNewItemName('')
    setNewItemAmount('')
    setNewItemDescription('')
    setShowAddItem(false)
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg">This Month</h2>
          <MonthSwitcher monthId={monthId} onChange={setMonthId} />
        </div>
        <SummaryHero salary={month?.salary ?? 0} items={items} />
        <label className="flex justify-between items-center py-3 text-sm border-b border-line">
          <span className="text-ink-soft">Edit salary</span>
          <input
            type="number"
            defaultValue={month?.salary ?? 0}
            onBlur={(event) => setSalary(Number(event.target.value))}
            className="font-mono border border-line rounded px-2 py-1 w-32 text-right bg-paper"
          />
        </label>
        {categories.map((category) => (
          <LedgerSection
            key={category.id}
            categoryName={category.name}
            items={items.filter((item) => item.categoryId === category.id)}
            subtotal={subtotals[category.id] ?? 0}
            onToggleStatus={toggleItemStatus}
            onAmountChange={updateItemAmount}
          />
        ))}

        <div className="pt-4">
          {!showAddItem ? (
            <button type="button" onClick={() => setShowAddItem(true)} className="text-sm text-brass font-medium">
              + Add one-off expense
            </button>
          ) : (
            <form onSubmit={handleAddOneOff} className="flex flex-col gap-2 border border-line rounded p-4 mt-2">
              <input
                aria-label="One-off item name"
                placeholder="What's this for?"
                value={newItemName}
                onChange={(event) => setNewItemName(event.target.value)}
                required
                className="border border-line rounded px-2 py-1 bg-paper text-sm"
              />
              <div className="flex gap-2">
                <input
                  aria-label="One-off item amount"
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={newItemAmount}
                  onChange={(event) => setNewItemAmount(event.target.value)}
                  required
                  className="border border-line rounded px-2 py-1 bg-paper text-sm w-28 font-mono"
                />
                <select
                  aria-label="One-off item category"
                  value={newItemCategoryId || categories[0].id}
                  onChange={(event) => setNewItemCategoryId(event.target.value)}
                  className="border border-line rounded px-2 py-1 bg-paper text-sm flex-1"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                aria-label="One-off item description"
                placeholder="Description (optional)"
                value={newItemDescription}
                onChange={(event) => setNewItemDescription(event.target.value)}
                className="border border-line rounded px-2 py-1 bg-paper text-sm"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddItem(false)} className="px-3 py-1.5 text-sm">
                  Cancel
                </button>
                <button type="submit" className="bg-brass text-paper px-3 py-1.5 rounded text-sm">
                  Add expense
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  )
}
