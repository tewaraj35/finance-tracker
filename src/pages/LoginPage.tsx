import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
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
    default:
      return 'Something went wrong signing in. Please try again.'
  }
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(email: string, password: string) {
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
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
