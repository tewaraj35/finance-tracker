import { useEffect, useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { initTheme, toggleTheme, type ThemeMode } from '../../lib/theme'
import { useOnlineStatus } from '../../lib/useOnlineStatus'
import { SyncIndicator } from './SyncIndicator'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1 rounded font-medium ${isActive ? 'bg-brass text-paper' : 'text-ink-soft'}`

export function AppShell({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light')
  const isOnline = useOnlineStatus()

  useEffect(() => {
    setMode(initTheme())
  }, [])

  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      <SyncIndicator isOnline={isOnline} />
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b-2 border-ink">
        <span className="font-display text-xl font-semibold">Finance Ledger</span>
        <nav className="flex gap-2">
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
          <NavLink to="/commitments" className={navLinkClass}>Commitments</NavLink>
          <NavLink to="/history" className={navLinkClass}>History</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMode(toggleTheme(mode))}
            aria-label="Toggle dark mode"
            className="border border-line rounded px-2 py-1 text-sm"
          >
            {mode === 'light' ? '🌙' : '☀️'}
          </button>
          <button type="button" onClick={() => signOut(auth)} className="text-sm text-ink-soft">
            Sign out
          </button>
        </div>
      </header>
      <main className="px-6 py-6">{children}</main>
    </div>
  )
}
