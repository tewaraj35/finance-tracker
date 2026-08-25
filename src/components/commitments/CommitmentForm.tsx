import { useState, type FormEvent } from 'react'
import type { Category, Commitment } from '../../types/models'

export interface CommitmentFormProps {
  categories: Category[]
  initial?: Partial<Commitment>
  onSubmit: (input: Omit<Commitment, 'id'>) => void
  onCancel: () => void
}

export function CommitmentForm({ categories, initial, onSubmit, onCancel }: CommitmentFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [amount, setAmount] = useState(String(initial?.amount ?? ''))
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit({ name, amount: Number(amount), categoryId, description, active: true })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} required className="border border-line rounded px-2 py-1 bg-paper" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Amount
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
          className="border border-line rounded px-2 py-1 bg-paper"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Category
        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="border border-line rounded px-2 py-1 bg-paper">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Description
        <input value={description} onChange={(event) => setDescription(event.target.value)} className="border border-line rounded px-2 py-1 bg-paper" />
      </label>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm">
          Cancel
        </button>
        <button type="submit" className="bg-paid text-paper px-3 py-1.5 rounded text-sm">
          Save
        </button>
      </div>
    </form>
  )
}
