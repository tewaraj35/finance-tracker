import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  writeBatch,
  type Query,
} from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { db } from '../firebase/config'
import type { Category } from '../types/models'

function categoriesRef(uid: string) {
  return collection(db, 'users', uid, 'categories')
}

export function useCategories(uid: string) {
  const categoriesQuery = query(categoriesRef(uid), orderBy('sortOrder')) as unknown as Query<Category>
  const [categories, loading, error] = useCollectionData<Category>(categoriesQuery, { idField: 'id' } as unknown as any)

  async function addCategory(name: string) {
    const count = categories?.length ?? 0
    await addDoc(categoriesRef(uid), { name, sortOrder: count } satisfies Omit<Category, 'id'>)
  }

  async function renameCategory(id: string, name: string) {
    await updateDoc(doc(db, 'users', uid, 'categories', id), { name })
  }

  async function reorderCategories(orderedIds: string[]) {
    const batch = writeBatch(db)
    orderedIds.forEach((id, index) => {
      batch.update(doc(db, 'users', uid, 'categories', id), { sortOrder: index })
    })
    await batch.commit()
  }

  async function deleteCategory(id: string) {
    await deleteDoc(doc(db, 'users', uid, 'categories', id))
  }

  return { categories: categories ?? [], loading, error, addCategory, renameCategory, reorderCategories, deleteCategory }
}
