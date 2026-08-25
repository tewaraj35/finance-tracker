import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { LoginForm } from '../components/auth/LoginForm'
import { auth } from '../firebase/config'

function mapAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password.'
    case 'auth/user-not-found':
      return 'No account found with that email.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.'
    case 'auth/email-already-in-use':
      return 'An account with that email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    default:
      return 'Something went wrong signing in. Please try again.'
  }
}

export default function LoginPage() {
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  async function handleSubmit(email: string, password: string, mode: 'signin' | 'signup') {
    setLoading(true)
    setError(null)
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(mapAuthError((err as { code?: string }).code ?? ''))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true)
    setError(null)
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (err) {
      setError(mapAuthError((err as { code?: string }).code ?? ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper text-ink p-6">
      <LoginForm onSubmit={handleSubmit} onGoogleSignIn={handleGoogleSignIn} error={error} loading={loading} />
    </div>
  )
}
