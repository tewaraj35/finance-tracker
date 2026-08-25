import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type CollectionReference,
  type DocumentReference,
} from 'firebase/firestore'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { db } from '../firebase/config'
import { cloneCommitmentsToItems } from '../lib/ledgerCalculations'
import type { Commitment, LineItem, MonthDoc } from '../types/models'

function monthDocRef(uid: string, monthId: string) {
  return doc(db, 'users', uid, 'months', monthId)
}

function monthsRef(uid: string) {
  return collection(db, 'users', uid, 'months')
}

async function ensureMonthSnapshot(uid: string, monthId: string, commitments: Commitment[]): Promise<void> {
  const ref = monthDocRef(uid, monthId)
  const existing = await getDoc(ref)
  if (existing.exists()) return
  const snapshot: MonthDoc = { id: monthId, salary: 0, items: cloneCommitmentsToItems(commitments) }
  await setDoc(ref, snapshot)
}

export function useMonth(uid: string, monthId: string, commitments: Commitment[]) {
  const typedDocRef = monthDocRef(uid, monthId) as unknown as DocumentReference<MonthDoc>
  const [month, loading, error] = useDocumentData<MonthDoc>(typedDocRef)

  async function ensureExists() {
    await ensureMonthSnapshot(uid, monthId, commitments)
  }

  async function setSalary(amount: number) {
    await ensureExists()
    await updateDoc(monthDocRef(uid, monthId), { salary: amount })
  }

  async function updateItems(updater: (items: LineItem[]) => LineItem[]) {
    await ensureExists()
    const current = month?.items ?? cloneCommitmentsToItems(commitments)
    await updateDoc(monthDocRef(uid, monthId), { items: updater(current) })
  }

  async function toggleItemStatus(itemId: string) {
    await updateItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, status: item.status === 'PAID' ? 'PENDING' : 'PAID' } : item,
      ),
    )
  }

  async function updateItemAmount(itemId: string, amount: number) {
    await updateItems((items) => items.map((item) => (item.id === itemId ? { ...item, amount } : item)))
  }

  async function addOneOffItem(input: { name: string; categoryId: string; amount: number; description: string }) {
    await updateItems((items) => [
      ...items,
      { id: crypto.randomUUID(), status: 'PENDING', isOneOff: true, ...input },
    ])
  }

  return { month: month ?? null, loading, error, ensureExists, setSalary, toggleItemStatus, updateItemAmount, addOneOffItem }
}

export function useMonthsHistory(uid: string) {
  const typedRef = monthsRef(uid) as unknown as CollectionReference<MonthDoc>
  const [months, loading, error] = useCollectionData<MonthDoc>(typedRef)
  return { months: months ?? [], loading, error }
}
