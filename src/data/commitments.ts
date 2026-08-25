import { addDoc, collection, deleteDoc, doc, updateDoc, type CollectionReference } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../firebase/config'
import type { Commitment } from '../types/models'

function commitmentsRef(uid: string) {
  return collection(db, 'users', uid, 'commitments')
}

export function useCommitments(uid: string) {
  const typedRef = commitmentsRef(uid) as unknown as CollectionReference<Omit<Commitment, 'id'>>
  const [snapshot, loading, error] = useCollection(typedRef)
  const commitments: Commitment[] = snapshot?.docs.map((d) => ({ id: d.id, ...d.data() })) ?? []

  async function addCommitment(input: Omit<Commitment, 'id'>) {
    await addDoc(commitmentsRef(uid), input)
  }

  async function updateCommitment(id: string, patch: Partial<Omit<Commitment, 'id'>>) {
    await updateDoc(doc(db, 'users', uid, 'commitments', id), patch)
  }

  async function deleteCommitment(id: string) {
    await deleteDoc(doc(db, 'users', uid, 'commitments', id))
  }

  return { commitments, loading, error, addCommitment, updateCommitment, deleteCommitment }
}
