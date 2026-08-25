export type ThemeMode = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'finance-tracker-theme'

export function getStoredTheme(): ThemeMode | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

export function getSystemTheme(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(mode: ThemeMode): void {
  document.documentElement.classList.toggle('dark', mode === 'dark')
  localStorage.setItem(THEME_STORAGE_KEY, mode)
}

export function initTheme(): ThemeMode {
  const resolved = getStoredTheme() ?? getSystemTheme()
  applyTheme(resolved)
  return resolved
}

export function toggleTheme(current: ThemeMode): ThemeMode {
  const next: ThemeMode = current === 'light' ? 'dark' : 'light'
  applyTheme(next)
  return next
}
