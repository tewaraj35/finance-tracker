import { useState, type FormEvent } from 'react'

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => void
  onGoogleSignIn: () => void
  error: string | null
  loading: boolean
}

export function LoginForm({ onSubmit, onGoogleSignIn, error, loading }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm w-full">
      <h1 className="font-display text-2xl">Finance Ledger</h1>
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border border-line bg-paper px-3 py-2 rounded"
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border border-line bg-paper px-3 py-2 rounded"
          required
        />
      </label>
      {error && <p className="text-stamp-red text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-paid text-paper py-2 rounded font-medium disabled:opacity-50"
      >
        Sign in
      </button>
      <button
        type="button"
        onClick={onGoogleSignIn}
        className="border border-line py-2 rounded font-medium"
      >
        Sign in with Google
      </button>
    </form>
  )
}
