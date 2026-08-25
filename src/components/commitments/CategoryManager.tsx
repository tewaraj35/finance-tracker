import { useState, type FormEvent } from 'react'
import type { Category } from '../../types/models'

export interface CategoryManagerProps {
  categories: Category[]
  onAdd: (name: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onReorder: (orderedIds: string[]) => void
}

export function CategoryManager({ categories, onAdd, onRename, onDelete, onReorder }: CategoryManagerProps) {
  const [newName, setNewName] = useState('')

  function handleAdd(event: FormEvent) {
    event.preventDefault()
    if (!newName.trim()) return
    onAdd(newName.trim())
    setNewName('')
  }

  function move(index: number, delta: number) {
    const orderedIds = categories.map((category) => category.id)
    const target = index + delta
    ;[orderedIds[index], orderedIds[target]] = [orderedIds[target], orderedIds[index]]
    onReorder(orderedIds)
  }

  return (
    <div className="flex flex-col gap-2">
      {categories.map((category, index) => (
        <div key={category.id} className="flex items-center justify-between gap-2 py-1.5 border-t border-line first:border-t-0">
          <div className="flex flex-col">
            <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)} className="text-xs disabled:opacity-30">
              ↑
            </button>
            <button
              type="button"
              aria-label="Move down"
              disabled={index === categories.length - 1}
              onClick={() => move(index, 1)}
              className="text-xs disabled:opacity-30"
            >
              ↓
            </button>
          </div>
          <span className="sr-only">{category.name}</span>
          <input
            aria-label={`Rename ${category.name}`}
            defaultValue={category.name}
            onBlur={(event) => onRename(category.id, event.target.value)}
            className="bg-transparent flex-1"
          />
          <button type="button" onClick={() => onDelete(category.id)} className="text-stamp-red text-sm">
            Delete
          </button>
        </div>
      ))}
      <form onSubmit={handleAdd} className="flex gap-2 pt-2">
        <label className="flex-1">
          <span className="sr-only">New category</span>
          <input
            aria-label="New category"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="New category name"
            className="border border-line rounded px-2 py-1 w-full bg-paper"
          />
        </label>
        <button type="submit" className="bg-brass text-paper px-3 py-1 rounded text-sm">
          Add category
        </button>
      </form>
    </div>
  )
}
