import { onAuthStateChanged, type User } from 'firebase/auth'
import { createContext, useEffect, useState, type ReactNode } from 'react'
import { auth } from '../firebase/config'

export interface AuthContextValue {
  user: User | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextValue>({ user: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
