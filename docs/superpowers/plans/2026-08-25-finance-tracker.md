# Monthly Finance Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive React web app to track monthly salary against recurring commitments (loans, bills, insurance, family/discretionary spending), backed by Firebase, deployed to GitHub Pages.

**Architecture:** Vite + React + TypeScript SPA. Firestore holds per-user `categories`, a recurring `commitments` template, and per-month `months` snapshots. Pure calculation logic lives in `src/lib/`, fully unit tested; Firestore-backed hooks stay thin wrappers around that logic; presentational components are unit tested with React Testing Library; page containers wire hooks to components and are verified manually (no Firebase emulator in v1, per spec).

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, React Router (`HashRouter`), Firebase (Auth + Firestore), react-firebase-hooks, Recharts, Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-25-finance-tracker-design.md`

## Global Constraints

- Currency is RM/MYR only — no multi-currency support (spec: Out of Scope).
- Routing must use `HashRouter` — GitHub Pages has no server-side rewrites (spec: Tech Stack).
- All Firestore data lives under `users/{uid}/...` (spec: Data Model).
- No Firebase emulator or e2e suite in v1 — Firestore-touching hooks and page containers are verified manually against the Firebase console; only pure logic and presentational components get automated tests (spec: Testing Approach).
- Color tokens, font families, and the PAID-stamp signature element must match the spec's Visual Design section exactly (exact hex values, `Fraunces` / `IBM Plex Sans` / `IBM Plex Mono`).
- Dark mode follows `prefers-color-scheme` with a manual toggle override persisted to `localStorage` (spec: Visual Design).

---

## Task 1: Project Scaffold & Toolchain

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `src/setupTests.ts`
- Create: `src/App.test.tsx`

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build` / `npm run test` toolchain that every later task builds on.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "finance-tracker",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc -b --noEmit",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "firebase": "^10.12.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-firebase-hooks": "^5.1.1",
    "react-router-dom": "^6.24.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "gh-pages": "^6.1.0",
    "jsdom": "^24.1.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts", "postcss.config.js"]
}
```

- [ ] **Step 4: Create `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
```

- [ ] **Step 5: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Create `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        brass: 'var(--brass)',
        'stamp-red': 'var(--stamp-red)',
        paid: 'var(--paid)',
        line: 'var(--line)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 7: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Finance Ledger</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="font-body">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --paper: #F2F5EC;
  --ink: #1F3B2C;
  --ink-soft: #5C7268;
  --brass: #B8863B;
  --stamp-red: #B23A2E;
  --paid: #2F6B4F;
  --line: #D3DCC9;
}

.dark {
  --paper: #14201A;
  --ink: #E9EFE6;
  --ink-soft: #8FA396;
  --brass: #D9A857;
  --stamp-red: #E2645A;
  --paid: #5FBE8D;
  --line: #2A382F;
}

body {
  background-color: var(--paper);
  color: var(--ink);
}
```

- [ ] **Step 9: Create `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 10: Create placeholder `src/App.tsx`**

```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      <h1 className="font-display text-2xl p-6">Finance Ledger</h1>
    </div>
  )
}
```

- [ ] **Step 11: Create `src/setupTests.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 12: Write the smoke test — `src/App.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('Finance Ledger')).toBeInTheDocument()
  })
})
```

- [ ] **Step 13: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `package-lock.json` and `node_modules/`.

- [ ] **Step 14: Run the test to verify the toolchain works**

Run: `npm run test:run`
Expected: PASS — 1 test passed (`App > renders the app title`).

- [ ] **Step 15: Verify the build works**

Run: `npm run build`
Expected: builds successfully, creates `dist/`.

- [ ] **Step 16: Commit**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.node.json vite.config.ts index.html postcss.config.js tailwind.config.ts src/ .gitignore
git commit -m "chore: scaffold Vite + React + TS + Tailwind + Vitest toolchain"
```

---

## Task 2: Design Tokens & Theme Toggle

**Files:**
- Modify: `src/index.css` (already has tokens from Task 1 — no change needed here)
- Create: `src/lib/theme.ts`
- Create: `src/lib/theme.test.ts`

**Interfaces:**
- Produces: `getStoredTheme(): 'light' | 'dark' | null`, `getSystemTheme(): 'light' | 'dark'`, `applyTheme(mode: 'light' | 'dark'): void`, `initTheme(): 'light' | 'dark'`, `toggleTheme(current: 'light' | 'dark'): 'light' | 'dark'` — consumed by the `AppShell` dark-mode toggle in Task 6.

- [ ] **Step 1: Write the failing tests — `src/lib/theme.test.ts`**

```ts
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { applyTheme, getStoredTheme, toggleTheme, THEME_STORAGE_KEY } from './theme'

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('returns null when no theme is stored', () => {
    expect(getStoredTheme()).toBeNull()
  })

  it('returns the stored theme when present', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    expect(getStoredTheme()).toBe('dark')
  })

  it('ignores invalid stored values', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'purple')
    expect(getStoredTheme()).toBeNull()
  })

  it('applyTheme adds the dark class and persists for dark mode', () => {
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('applyTheme removes the dark class and persists for light mode', () => {
    document.documentElement.classList.add('dark')
    applyTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('toggleTheme flips light to dark and vice versa', () => {
    expect(toggleTheme('light')).toBe('dark')
    expect(toggleTheme('dark')).toBe('light')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/lib/theme.test.ts`
Expected: FAIL — `./theme` module not found.

- [ ] **Step 3: Implement `src/lib/theme.ts`**

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/lib/theme.test.ts`
Expected: PASS — 6 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme.ts src/lib/theme.test.ts
git commit -m "feat: add theme token CSS variables and dark-mode toggle logic"
```

---

## Task 3: Domain Types & Pure Ledger Calculations

**Files:**
- Create: `src/types/models.ts`
- Create: `src/lib/ledgerCalculations.ts`
- Create: `src/lib/ledgerCalculations.test.ts`

**Interfaces:**
- Produces (types): `Category`, `Commitment`, `ItemStatus`, `LineItem`, `MonthDoc`.
- Produces (functions): `getMonthId(date: Date): string`, `cloneCommitmentsToItems(commitments: Commitment[]): LineItem[]`, `computeTotalCommitted(items: LineItem[]): number`, `computeRemainingBalance(salary: number, items: LineItem[]): number`, `computeCategorySubtotals(items: LineItem[]): Record<string, number>`, `computePaidPendingTotals(items: LineItem[]): { paid: number; pending: number }`, `computePaidRatio(items: LineItem[]): number`.
- Consumed by: `data/months.ts` (Task 13), `SummaryHero`/`LedgerSection` components (Tasks 9-10), chart data builders (Task 16).

- [ ] **Step 1: Create `src/types/models.ts`**

```ts
export interface Category {
  id: string
  name: string
  sortOrder: number
}

export interface Commitment {
  id: string
  name: string
  categoryId: string
  amount: number
  description: string
  active: boolean
}

export type ItemStatus = 'PAID' | 'PENDING'

export interface LineItem {
  id: string
  name: string
  categoryId: string
  amount: number
  description: string
  status: ItemStatus
  isOneOff: boolean
}

export interface MonthDoc {
  id: string
  salary: number
  items: LineItem[]
}
```

- [ ] **Step 2: Write the failing tests — `src/lib/ledgerCalculations.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import {
  cloneCommitmentsToItems,
  computeCategorySubtotals,
  computePaidPendingTotals,
  computePaidRatio,
  computeRemainingBalance,
  computeTotalCommitted,
  getMonthId,
} from './ledgerCalculations'
import type { Commitment, LineItem } from '../types/models'

const commitments: Commitment[] = [
  { id: 'c1', name: 'Car', categoryId: 'loans', amount: 599, description: 'Ambank', active: true },
  { id: 'c2', name: 'Electricity', categoryId: 'bills', amount: 142.85, description: '', active: true },
  { id: 'c3', name: 'Inactive', categoryId: 'bills', amount: 50, description: '', active: false },
]

const items: LineItem[] = [
  { id: 'c1', name: 'Car', categoryId: 'loans', amount: 599, description: 'Ambank', status: 'PAID', isOneOff: false },
  { id: 'c2', name: 'Electricity', categoryId: 'bills', amount: 142.85, description: '', status: 'PENDING', isOneOff: false },
  { id: 'x1', name: 'Surprise repair', categoryId: 'bills', amount: 100, description: '', status: 'PENDING', isOneOff: true },
]

describe('getMonthId', () => {
  it('formats a date as YYYY-MM', () => {
    expect(getMonthId(new Date(2026, 7, 25))).toBe('2026-08')
  })

  it('pads single-digit months', () => {
    expect(getMonthId(new Date(2026, 0, 1))).toBe('2026-01')
  })
})

describe('cloneCommitmentsToItems', () => {
  it('clones only active commitments as PENDING, non-one-off items', () => {
    const result = cloneCommitmentsToItems(commitments)
    expect(result).toHaveLength(2)
    expect(result.every((item) => item.status === 'PENDING')).toBe(true)
    expect(result.every((item) => item.isOneOff === false)).toBe(true)
    expect(result.map((item) => item.id)).toEqual(['c1', 'c2'])
  })
})

describe('computeTotalCommitted', () => {
  it('sums all item amounts', () => {
    expect(computeTotalCommitted(items)).toBeCloseTo(841.85)
  })

  it('returns 0 for an empty list', () => {
    expect(computeTotalCommitted([])).toBe(0)
  })
})

describe('computeRemainingBalance', () => {
  it('subtracts total committed from salary', () => {
    expect(computeRemainingBalance(6500, items)).toBeCloseTo(6500 - 841.85)
  })
})

describe('computeCategorySubtotals', () => {
  it('groups amounts by categoryId', () => {
    expect(computeCategorySubtotals(items)).toEqual({
      loans: 599,
      bills: 242.85,
    })
  })
})

describe('computePaidPendingTotals', () => {
  it('splits totals by status', () => {
    expect(computePaidPendingTotals(items)).toEqual({ paid: 599, pending: 242.85 })
  })
})

describe('computePaidRatio', () => {
  it('returns the paid fraction of the total committed', () => {
    expect(computePaidRatio(items)).toBeCloseTo(599 / 841.85)
  })

  it('returns 0 when there are no items', () => {
    expect(computePaidRatio([])).toBe(0)
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm run test:run -- src/lib/ledgerCalculations.test.ts`
Expected: FAIL — `./ledgerCalculations` module not found.

- [ ] **Step 4: Implement `src/lib/ledgerCalculations.ts`**

```ts
import type { Commitment, LineItem } from '../types/models'

export function getMonthId(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function cloneCommitmentsToItems(commitments: Commitment[]): LineItem[] {
  return commitments
    .filter((commitment) => commitment.active)
    .map((commitment) => ({
      id: commitment.id,
      name: commitment.name,
      categoryId: commitment.categoryId,
      amount: commitment.amount,
      description: commitment.description,
      status: 'PENDING',
      isOneOff: false,
    }))
}

export function computeTotalCommitted(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0)
}

export function computeRemainingBalance(salary: number, items: LineItem[]): number {
  return salary - computeTotalCommitted(items)
}

export function computeCategorySubtotals(items: LineItem[]): Record<string, number> {
  const subtotals: Record<string, number> = {}
  for (const item of items) {
    subtotals[item.categoryId] = (subtotals[item.categoryId] ?? 0) + item.amount
  }
  return subtotals
}

export function computePaidPendingTotals(items: LineItem[]): { paid: number; pending: number } {
  return items.reduce(
    (totals, item) => {
      if (item.status === 'PAID') totals.paid += item.amount
      else totals.pending += item.amount
      return totals
    },
    { paid: 0, pending: 0 },
  )
}

export function computePaidRatio(items: LineItem[]): number {
  const total = computeTotalCommitted(items)
  if (total === 0) return 0
  const { paid } = computePaidPendingTotals(items)
  return paid / total
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test:run -- src/lib/ledgerCalculations.test.ts`
Expected: PASS — all tests passed.

- [ ] **Step 6: Commit**

```bash
git add src/types/models.ts src/lib/ledgerCalculations.ts src/lib/ledgerCalculations.test.ts
git commit -m "feat: add domain types and pure ledger calculation functions"
```

---

## Task 4: Firebase Configuration

**Files:**
- Create: `src/firebase/config.ts`
- Create: `.env.example`

**Interfaces:**
- Produces: `app` (Firebase App), `auth` (Firebase Auth instance), `db` (Firestore instance) — consumed by `AuthProvider` (Task 5) and all `data/*.ts` hooks (Tasks 11-13).

- [ ] **Step 1: Create `.env.example`**

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

- [ ] **Step 2: Implement `src/firebase/config.ts`**

```ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

enableIndexedDbPersistence(db).catch(() => {
  // Multiple tabs open, or browser doesn't support persistence — app still
  // works online, it just won't cache writes offline.
})
```

- [ ] **Step 3: Create local `.env` from the example**

Run: `cp .env.example .env` (fill in real Firebase project values from the Firebase console — create a project there first if one doesn't exist yet, with Email/Password and Google sign-in enabled under Authentication, and Firestore created in production mode).

- [ ] **Step 4: Verify the app still builds with the Firebase SDK added**

Run: `npm run build`
Expected: builds successfully (Firebase config module isn't imported anywhere yet, but this confirms the `firebase` package resolves correctly).

- [ ] **Step 5: Commit**

```bash
git add src/firebase/config.ts .env.example
git commit -m "feat: add Firebase app/auth/firestore configuration"
```

Note: `.env` itself is gitignored and must never be committed.

---

## Task 5: Auth Context, Protected Route & Login Form

**Files:**
- Create: `src/auth/AuthProvider.tsx`
- Create: `src/auth/useAuth.ts`
- Create: `src/auth/ProtectedRoute.tsx`
- Create: `src/components/auth/LoginForm.tsx`
- Create: `src/components/auth/LoginForm.test.tsx`
- Create: `src/pages/LoginPage.tsx`

**Interfaces:**
- Produces: `AuthProvider` (React component), `useAuth(): { user: import('firebase/auth').User | null; loading: boolean }`, `ProtectedRoute` (component wrapping children, redirects to `/login` when unauthenticated), `LoginForm` props `{ onSubmit: (email: string, password: string) => void; onGoogleSignIn: () => void; error: string | null; loading: boolean }`.
- Consumed by: `App.tsx` routing (Task 6).

- [ ] **Step 1: Implement `src/auth/AuthProvider.tsx`**

```tsx
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
```

- [ ] **Step 2: Implement `src/auth/useAuth.ts`**

```ts
import { useContext } from 'react'
import { AuthContext } from './AuthProvider'

export function useAuth() {
  return useContext(AuthContext)
}
```

- [ ] **Step 3: Implement `src/auth/ProtectedRoute.tsx`**

```tsx
import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './useAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ink-soft">Loading…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
```

- [ ] **Step 4: Write the failing test — `src/components/auth/LoginForm.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('calls onSubmit with the entered email and password', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<LoginForm onSubmit={onSubmit} onGoogleSignIn={vi.fn()} error={null} loading={false} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'hunter2')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(onSubmit).toHaveBeenCalledWith('test@example.com', 'hunter2')
  })

  it('calls onGoogleSignIn when the Google button is clicked', async () => {
    const onGoogleSignIn = vi.fn()
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} onGoogleSignIn={onGoogleSignIn} error={null} loading={false} />)

    await user.click(screen.getByRole('button', { name: /google/i }))

    expect(onGoogleSignIn).toHaveBeenCalled()
  })

  it('shows the error message when provided', () => {
    render(<LoginForm onSubmit={vi.fn()} onGoogleSignIn={vi.fn()} error="Wrong password" loading={false} />)
    expect(screen.getByText('Wrong password')).toBeInTheDocument()
  })

  it('disables the submit button while loading', () => {
    render(<LoginForm onSubmit={vi.fn()} onGoogleSignIn={vi.fn()} error={null} loading={true} />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled()
  })
})
```

- [ ] **Step 5: Run tests to verify they fail**

Run: `npm run test:run -- src/components/auth/LoginForm.test.tsx`
Expected: FAIL — `./LoginForm` module not found.

- [ ] **Step 6: Implement `src/components/auth/LoginForm.tsx`**

```tsx
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
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm run test:run -- src/components/auth/LoginForm.test.tsx`
Expected: PASS — all 4 tests passed.

- [ ] **Step 8: Implement the container `src/pages/LoginPage.tsx`** (not unit tested — wires real Firebase Auth calls; verify manually per Step 9)

```tsx
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
```

- [ ] **Step 9: Manually verify against the Firebase console**

With `.env` filled in from Task 4 and `npm run dev` running, confirm: signing in with a valid email/password Firebase user succeeds; an invalid password shows "Incorrect email or password."; Google sign-in opens the popup and succeeds.

- [ ] **Step 10: Commit**

```bash
git add src/auth/ src/components/auth/ src/pages/LoginPage.tsx
git commit -m "feat: add auth context, protected route, and login page"
```

---

## Task 6: App Shell & Routing

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/pages/DashboardPage.tsx` (placeholder, filled in Task 14)
- Create: `src/pages/CommitmentsPage.tsx` (placeholder, filled in Task 15)
- Create: `src/pages/HistoryPage.tsx` (placeholder, filled in Task 16)

**Interfaces:**
- Consumes: `AuthProvider`, `ProtectedRoute` (Task 5), `initTheme`/`toggleTheme` (Task 2).
- Produces: `AppShell` component with props `{ children: ReactNode }`, rendering a header (brand, nav links to `/dashboard` `/commitments` `/history`, dark-mode toggle button) — consumed by Dashboard/Commitments/History pages.

- [ ] **Step 1: Create placeholder pages**

`src/pages/DashboardPage.tsx`:
```tsx
import { AppShell } from '../components/layout/AppShell'

export default function DashboardPage() {
  return (
    <AppShell>
      <p>Dashboard coming soon.</p>
    </AppShell>
  )
}
```

`src/pages/CommitmentsPage.tsx`:
```tsx
import { AppShell } from '../components/layout/AppShell'

export default function CommitmentsPage() {
  return (
    <AppShell>
      <p>Manage commitments coming soon.</p>
    </AppShell>
  )
}
```

`src/pages/HistoryPage.tsx`:
```tsx
import { AppShell } from '../components/layout/AppShell'

export default function HistoryPage() {
  return (
    <AppShell>
      <p>History coming soon.</p>
    </AppShell>
  )
}
```

- [ ] **Step 2: Implement `src/components/layout/AppShell.tsx`**

```tsx
import { useEffect, useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { initTheme, toggleTheme, type ThemeMode } from '../../lib/theme'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1 rounded font-medium ${isActive ? 'bg-brass text-paper' : 'text-ink-soft'}`

export function AppShell({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light')

  useEffect(() => {
    setMode(initTheme())
  }, [])

  return (
    <div className="min-h-screen bg-paper text-ink font-body">
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
```

- [ ] **Step 3: Replace `src/App.tsx` with routing**

```tsx
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { ProtectedRoute } from './auth/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CommitmentsPage from './pages/CommitmentsPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/commitments"
            element={
              <ProtectedRoute>
                <CommitmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
```

- [ ] **Step 4: Update the now-outdated smoke test — `src/App.test.tsx`**

The old test asserted an `<h1>Finance Ledger</h1>` that no longer exists at the app root (it moved into `AppShell`, and the root now redirects unauthenticated users to `/login`). Replace it:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('redirects unauthenticated users to the login page', async () => {
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Finance Ledger' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:run -- src/App.test.tsx`
Expected: PASS.

- [ ] **Step 6: Manually verify routing**

Run: `npm run dev`. Confirm visiting `/#/dashboard` while signed out redirects to `/#/login`; after Task 5's manual sign-in check, confirm nav links switch between the three pages and the dark-mode toggle flips the palette.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/components/layout/AppShell.tsx src/pages/DashboardPage.tsx src/pages/CommitmentsPage.tsx src/pages/HistoryPage.tsx
git commit -m "feat: add app shell, navigation, and hash-based routing"
```

---

## Task 7: PaidStamp Component

**Files:**
- Create: `src/components/ledger/PaidStamp.tsx`
- Create: `src/components/ledger/PaidStamp.test.tsx`

**Interfaces:**
- Produces: `PaidStamp` component, props `{ status: ItemStatus; onClick?: () => void }` — consumed by `LineItem` (Task 8).

- [ ] **Step 1: Write the failing tests — `src/components/ledger/PaidStamp.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PaidStamp } from './PaidStamp'

describe('PaidStamp', () => {
  it('renders PAID text and styling for a paid item', () => {
    render(<PaidStamp status="PAID" />)
    const stamp = screen.getByText('PAID')
    expect(stamp).toBeInTheDocument()
    expect(stamp).toHaveClass('border-paid')
  })

  it('renders PENDING text and styling for a pending item', () => {
    render(<PaidStamp status="PENDING" />)
    const stamp = screen.getByText('PENDING')
    expect(stamp).toBeInTheDocument()
    expect(stamp).toHaveClass('border-stamp-red')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<PaidStamp status="PENDING" onClick={onClick} />)
    await user.click(screen.getByText('PENDING'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/components/ledger/PaidStamp.test.tsx`
Expected: FAIL — `./PaidStamp` module not found.

- [ ] **Step 3: Implement `src/components/ledger/PaidStamp.tsx`**

```tsx
import type { ItemStatus } from '../../types/models'

export interface PaidStampProps {
  status: ItemStatus
  onClick?: () => void
}

export function PaidStamp({ status, onClick }: PaidStampProps) {
  const isPaid = status === 'PAID'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-mono text-[10px] font-semibold tracking-wide rounded px-2 py-0.5 -rotate-6 ${
        isPaid ? 'border-2 border-paid text-paid' : 'border-2 border-dashed border-stamp-red text-stamp-red'
      }`}
    >
      {status}
    </button>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/components/ledger/PaidStamp.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/ledger/PaidStamp.tsx src/components/ledger/PaidStamp.test.tsx
git commit -m "feat: add PaidStamp signature status component"
```

---

## Task 8: LineItem Component

**Files:**
- Create: `src/components/ledger/LineItem.tsx`
- Create: `src/components/ledger/LineItem.test.tsx`

**Interfaces:**
- Consumes: `PaidStamp` (Task 7), `LineItem` type (Task 3).
- Produces: `LineItem` component (`LineItemRow` to avoid name clash with the `LineItem` type), props `{ item: LineItemType; onToggleStatus: (itemId: string) => void; onAmountChange: (itemId: string, amount: number) => void }` — consumed by `LedgerSection` (Task 9). The amount is an editable field (spec: line items support a per-month amount override), not static text.

- [ ] **Step 1: Write the failing tests — `src/components/ledger/LineItem.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LineItemRow } from './LineItem'
import type { LineItem } from '../../types/models'

const item: LineItem = {
  id: 'c1',
  name: 'Car',
  categoryId: 'loans',
  amount: 599,
  description: 'Ambank',
  status: 'PAID',
  isOneOff: false,
}

describe('LineItemRow', () => {
  it('renders the name, description, and amount input', () => {
    render(<LineItemRow item={item} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.getByText('Car')).toBeInTheDocument()
    expect(screen.getByText('Ambank')).toBeInTheDocument()
    expect(screen.getByLabelText(/amount/i)).toHaveValue(599)
  })

  it('omits the description element when there is none', () => {
    render(<LineItemRow item={{ ...item, description: '' }} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.queryByText('Ambank')).not.toBeInTheDocument()
  })

  it('shows a one-off badge for one-off items', () => {
    render(<LineItemRow item={{ ...item, isOneOff: true }} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.getByText('one-off')).toBeInTheDocument()
  })

  it('does not show a one-off badge for template items', () => {
    render(<LineItemRow item={item} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.queryByText('one-off')).not.toBeInTheDocument()
  })

  it('calls onToggleStatus with the item id when the stamp is clicked', async () => {
    const onToggleStatus = vi.fn()
    const user = userEvent.setup()
    render(<LineItemRow item={item} onToggleStatus={onToggleStatus} onAmountChange={vi.fn()} />)
    await user.click(screen.getByText('PAID'))
    expect(onToggleStatus).toHaveBeenCalledWith('c1')
  })

  it('calls onAmountChange with the parsed value when the amount input loses focus', async () => {
    const onAmountChange = vi.fn()
    const user = userEvent.setup()
    render(<LineItemRow item={item} onToggleStatus={vi.fn()} onAmountChange={onAmountChange} />)
    const input = screen.getByLabelText(/amount/i)
    await user.clear(input)
    await user.type(input, '650')
    await user.tab()
    expect(onAmountChange).toHaveBeenCalledWith('c1', 650)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/components/ledger/LineItem.test.tsx`
Expected: FAIL — `./LineItem` module not found.

- [ ] **Step 3: Implement `src/components/ledger/LineItem.tsx`**

```tsx
import type { LineItem } from '../../types/models'
import { PaidStamp } from './PaidStamp'

export interface LineItemRowProps {
  item: LineItem
  onToggleStatus: (itemId: string) => void
  onAmountChange: (itemId: string, amount: number) => void
}

export function LineItemRow({ item, onToggleStatus, onAmountChange }: LineItemRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-t border-dashed border-line first:border-t-0">
      <span className="text-sm">
        {item.name}
        {item.isOneOff && <span className="text-[10px] text-brass ml-1.5 align-middle">one-off</span>}
        {item.description && <span className="block text-xs text-ink-soft">{item.description}</span>}
      </span>
      <span className="flex items-center gap-2.5">
        <span className="font-mono text-sm text-ink-soft">RM</span>
        <label>
          <span className="sr-only">Amount</span>
          <input
            aria-label="Amount"
            type="number"
            step="0.01"
            defaultValue={item.amount}
            onBlur={(event) => onAmountChange(item.id, Number(event.target.value))}
            className="font-mono text-sm w-20 text-right bg-transparent border-b border-transparent focus:border-line focus-visible:ring-2 focus-visible:ring-brass"
          />
        </label>
        <PaidStamp status={item.status} onClick={() => onToggleStatus(item.id)} />
      </span>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/components/ledger/LineItem.test.tsx`
Expected: PASS — 6 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/ledger/LineItem.tsx src/components/ledger/LineItem.test.tsx
git commit -m "feat: add LineItem row component"
```

---

## Task 9: LedgerSection Component

**Files:**
- Create: `src/components/ledger/LedgerSection.tsx`
- Create: `src/components/ledger/LedgerSection.test.tsx`

**Interfaces:**
- Consumes: `LineItemRow` (Task 8), `computeCategorySubtotals` is NOT used here — the subtotal is passed in as a prop so this component stays presentational.
- Produces: `LedgerSection` component, props `{ categoryName: string; items: LineItemType[]; subtotal: number; onToggleStatus: (itemId: string) => void; onAmountChange: (itemId: string, amount: number) => void }` — consumed by `DashboardPage` (Task 14).

- [ ] **Step 1: Write the failing tests — `src/components/ledger/LedgerSection.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LedgerSection } from './LedgerSection'
import type { LineItem } from '../../types/models'

const items: LineItem[] = [
  { id: 'c1', name: 'Car', categoryId: 'loans', amount: 599, description: 'Ambank', status: 'PAID', isOneOff: false },
  { id: 'c2', name: 'Kajang House', categoryId: 'loans', amount: 1151, description: 'RHB Bank', status: 'PAID', isOneOff: false },
]

describe('LedgerSection', () => {
  it('renders the category name, subtotal, and each item', () => {
    render(<LedgerSection categoryName="Bank Loans" items={items} subtotal={1750} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.getByText('Bank Loans')).toBeInTheDocument()
    expect(screen.getByText('RM 1750.00')).toBeInTheDocument()
    expect(screen.getByText('Car')).toBeInTheDocument()
    expect(screen.getByText('Kajang House')).toBeInTheDocument()
  })

  it('renders nothing for items when the list is empty', () => {
    render(<LedgerSection categoryName="Bills" items={[]} subtotal={0} onToggleStatus={vi.fn()} onAmountChange={vi.fn()} />)
    expect(screen.getByText('Bills')).toBeInTheDocument()
    expect(screen.getByText('RM 0.00')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/components/ledger/LedgerSection.test.tsx`
Expected: FAIL — `./LedgerSection` module not found.

- [ ] **Step 3: Implement `src/components/ledger/LedgerSection.tsx`**

```tsx
import type { LineItem } from '../../types/models'
import { LineItemRow } from './LineItem'

export interface LedgerSectionProps {
  categoryName: string
  items: LineItem[]
  subtotal: number
  onToggleStatus: (itemId: string) => void
  onAmountChange: (itemId: string, amount: number) => void
}

export function LedgerSection({ categoryName, items, subtotal, onToggleStatus, onAmountChange }: LedgerSectionProps) {
  return (
    <section className="py-3.5 border-t border-line first:border-t-0">
      <div className="flex justify-between font-display font-semibold text-sm uppercase tracking-wide text-ink-soft mb-1.5">
        <span>{categoryName}</span>
        <span className="font-mono normal-case tracking-normal">RM {subtotal.toFixed(2)}</span>
      </div>
      {items.map((item) => (
        <LineItemRow key={item.id} item={item} onToggleStatus={onToggleStatus} onAmountChange={onAmountChange} />
      ))}
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/components/ledger/LedgerSection.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/ledger/LedgerSection.tsx src/components/ledger/LedgerSection.test.tsx
git commit -m "feat: add LedgerSection category grouping component"
```

---

## Task 10: SummaryHero Component

**Files:**
- Create: `src/components/ledger/SummaryHero.tsx`
- Create: `src/components/ledger/SummaryHero.test.tsx`

**Interfaces:**
- Consumes: `computeTotalCommitted`, `computeRemainingBalance`, `computePaidRatio` (Task 3).
- Produces: `SummaryHero` component, props `{ salary: number; items: LineItemType[] }` — consumed by `DashboardPage` (Task 14).

- [ ] **Step 1: Write the failing tests — `src/components/ledger/SummaryHero.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SummaryHero } from './SummaryHero'
import type { LineItem } from '../../types/models'

const items: LineItem[] = [
  { id: 'c1', name: 'Car', categoryId: 'loans', amount: 599, description: '', status: 'PAID', isOneOff: false },
  { id: 'c2', name: 'PTPTN', categoryId: 'loans', amount: 251.83, description: '', status: 'PENDING', isOneOff: false },
]

describe('SummaryHero', () => {
  it('renders salary, committed total, and remaining balance', () => {
    render(<SummaryHero salary={6500} items={items} />)
    expect(screen.getByText('RM 6500.00')).toBeInTheDocument()
    expect(screen.getByText('RM 850.83')).toBeInTheDocument()
    expect(screen.getByText('RM 5649.17')).toBeInTheDocument()
  })

  it('sets the progress bar width to the paid ratio', () => {
    render(<SummaryHero salary={6500} items={items} />)
    const bar = screen.getByTestId('paid-progress-fill')
    expect(bar).toHaveStyle({ width: `${(599 / 850.83) * 100}%` })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/components/ledger/SummaryHero.test.tsx`
Expected: FAIL — `./SummaryHero` module not found.

- [ ] **Step 3: Implement `src/components/ledger/SummaryHero.tsx`**

```tsx
import { computePaidRatio, computeRemainingBalance, computeTotalCommitted } from '../../lib/ledgerCalculations'
import type { LineItem } from '../../types/models'

export interface SummaryHeroProps {
  salary: number
  items: LineItem[]
}

function formatCurrency(amount: number): string {
  return `RM ${amount.toFixed(2)}`
}

export function SummaryHero({ salary, items }: SummaryHeroProps) {
  const committed = computeTotalCommitted(items)
  const remaining = computeRemainingBalance(salary, items)
  const paidRatio = computePaidRatio(items)

  return (
    <div className="pb-4 border-b border-line">
      <div className="flex justify-between items-baseline py-1">
        <span className="text-xs uppercase tracking-wide text-ink-soft">Salary</span>
        <span className="font-mono text-sm">{formatCurrency(salary)}</span>
      </div>
      <div className="flex justify-between items-baseline py-1">
        <span className="text-xs uppercase tracking-wide text-ink-soft">Committed</span>
        <span className="font-mono text-sm">{formatCurrency(committed)}</span>
      </div>
      <div className="flex justify-between items-baseline py-1">
        <span className="text-sm uppercase tracking-wide text-ink-soft">Remaining</span>
        <span className="font-display text-3xl font-semibold text-paid">{formatCurrency(remaining)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-line mt-2.5 overflow-hidden">
        <div
          data-testid="paid-progress-fill"
          className="h-full bg-brass"
          style={{ width: `${paidRatio * 100}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/components/ledger/SummaryHero.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/ledger/SummaryHero.tsx src/components/ledger/SummaryHero.test.tsx
git commit -m "feat: add SummaryHero balance component"
```

---

## Task 11: Categories Firestore Hook

**Files:**
- Create: `src/data/categories.ts`

**Interfaces:**
- Consumes: `db` (Task 4), `Category` type (Task 3).
- Produces: `useCategories(uid: string): { categories: Category[]; loading: boolean; error: Error | undefined; addCategory(name: string): Promise<void>; renameCategory(id: string, name: string): Promise<void>; reorderCategories(orderedIds: string[]): Promise<void>; deleteCategory(id: string): Promise<void> }` — consumed by `CommitmentsPage` (Task 15) and `DashboardPage` (Task 14).

No Firestore emulator is used in this project (per spec), so this task has no automated test — it's a thin wrapper around `firestore`'s own SDK. Verify manually in Step 3.

- [ ] **Step 1: Implement `src/data/categories.ts`**

```ts
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
  const [categories, loading, error] = useCollectionData<Category>(categoriesQuery, { idField: 'id' })

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
```

- [ ] **Step 2: Verify the app still type-checks and builds**

Run: `npm run typecheck && npm run build`
Expected: no errors.

- [ ] **Step 3: Manually verify against the Firebase console**

Temporarily call `useCategories` from `CommitmentsPage` (placeholder from Task 6) with the signed-in user's `uid` (from `useAuth()`), render `categories.length` and a button calling `addCategory('Test Category')`. Confirm in `npm run dev` that clicking the button creates a document under `users/{uid}/categories` in the Firebase console with the right `sortOrder`, and that it appears in the rendered list. Revert the temporary wiring (Task 15 builds the real UI).

- [ ] **Step 4: Commit**

```bash
git add src/data/categories.ts
git commit -m "feat: add categories Firestore hook"
```

---

## Task 12: Commitments Firestore Hook

**Files:**
- Create: `src/data/commitments.ts`

**Interfaces:**
- Consumes: `db` (Task 4), `Commitment` type (Task 3).
- Produces: `useCommitments(uid: string): { commitments: Commitment[]; loading: boolean; error: Error | undefined; addCommitment(input: Omit<Commitment, 'id'>): Promise<void>; updateCommitment(id: string, patch: Partial<Omit<Commitment, 'id'>>): Promise<void>; deleteCommitment(id: string): Promise<void> }` — consumed by `CommitmentsPage` (Task 15), `useMonth` (Task 13), and `DashboardPage` (Task 14).

No automated test (Firestore-backed, per spec's testing scope) — verify manually in Step 3.

- [ ] **Step 1: Implement `src/data/commitments.ts`**

```ts
import { addDoc, collection, deleteDoc, doc, updateDoc, type CollectionReference } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { db } from '../firebase/config'
import type { Commitment } from '../types/models'

function commitmentsRef(uid: string) {
  return collection(db, 'users', uid, 'commitments')
}

export function useCommitments(uid: string) {
  const typedRef = commitmentsRef(uid) as unknown as CollectionReference<Commitment>
  const [commitments, loading, error] = useCollectionData<Commitment>(typedRef, { idField: 'id' })

  async function addCommitment(input: Omit<Commitment, 'id'>) {
    await addDoc(commitmentsRef(uid), input)
  }

  async function updateCommitment(id: string, patch: Partial<Omit<Commitment, 'id'>>) {
    await updateDoc(doc(db, 'users', uid, 'commitments', id), patch)
  }

  async function deleteCommitment(id: string) {
    await deleteDoc(doc(db, 'users', uid, 'commitments', id))
  }

  return { commitments: commitments ?? [], loading, error, addCommitment, updateCommitment, deleteCommitment }
}
```

- [ ] **Step 2: Verify the app still type-checks and builds**

Run: `npm run typecheck && npm run build`
Expected: no errors.

- [ ] **Step 3: Manually verify against the Firebase console**

Same approach as Task 11 Step 3: temporarily wire `useCommitments` into `CommitmentsPage`, add a test commitment, confirm the document appears under `users/{uid}/commitments` with the right fields, then revert (Task 15 builds the real UI).

- [ ] **Step 4: Commit**

```bash
git add src/data/commitments.ts
git commit -m "feat: add commitments Firestore hook"
```

---

## Task 13: Months Firestore Hook (Snapshot Generation)

**Files:**
- Create: `src/data/months.ts`

**Interfaces:**
- Consumes: `db` (Task 4), `getMonthId`/`cloneCommitmentsToItems` (Task 3), `Commitment`/`MonthDoc`/`LineItem` types (Task 3).
- Produces: `useMonth(uid: string, monthId: string, commitments: Commitment[]): { month: MonthDoc | null; loading: boolean; error: Error | undefined; setSalary(amount: number): Promise<void>; toggleItemStatus(itemId: string): Promise<void>; updateItemAmount(itemId: string, amount: number): Promise<void>; addOneOffItem(input: { name: string; categoryId: string; amount: number; description: string }): Promise<void> }`, `useMonthsHistory(uid: string): { months: MonthDoc[]; loading: boolean; error: Error | undefined }` — consumed by `DashboardPage` (Task 14) and `HistoryPage` (Task 16).

No automated test (Firestore-backed) — the snapshot-cloning logic it depends on (`cloneCommitmentsToItems`) is already unit tested in Task 3. Verify manually in Step 3.

- [ ] **Step 1: Implement `src/data/months.ts`**

```ts
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
  const [months, loading, error] = useCollectionData<MonthDoc>(typedRef, { idField: 'id' })
  return { months: months ?? [], loading, error }
}
```

- [ ] **Step 2: Verify the app still type-checks and builds**

Run: `npm run typecheck && npm run build`
Expected: no errors.

- [ ] **Step 3: Manually verify against the Firebase console**

Temporarily wire `useMonth(uid, getMonthId(new Date()), commitments)` into `DashboardPage`. Confirm: first load creates a `users/{uid}/months/{YYYY-MM}` document cloning current commitments as `PENDING`; reloading the page doesn't duplicate items; calling `toggleItemStatus` flips one item's status in the console; calling `setSalary` updates the salary field. Revert the temporary wiring (Task 14 builds the real UI).

- [ ] **Step 4: Commit**

```bash
git add src/data/months.ts
git commit -m "feat: add months Firestore hook with idempotent snapshot generation"
```

---

## Task 14: Dashboard Page

**Files:**
- Modify: `src/pages/DashboardPage.tsx`
- Create: `src/components/ledger/MonthSwitcher.tsx`
- Create: `src/components/ledger/MonthSwitcher.test.tsx`
- Create: `src/components/ledger/EmptyState.tsx`

**Interfaces:**
- Consumes: `useAuth` (Task 5), `useCategories` (Task 11), `useCommitments` (Task 12), `useMonth` (Task 13, including `updateItemAmount` and `addOneOffItem` — both must be wired into the UI here, since no other task does), `SummaryHero` (Task 10), `LedgerSection` (Task 9), `getMonthId` (Task 3), `AppShell` (Task 6).
- Produces: `MonthSwitcher` component, props `{ monthId: string; onChange: (monthId: string) => void }`; `EmptyState` component, props `{ message: string; actionLabel: string; onAction: () => void }` — both usable elsewhere (e.g. `EmptyState` reused in Task 15 for an empty commitments list).

- [ ] **Step 1: Write the failing tests — `src/components/ledger/MonthSwitcher.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MonthSwitcher } from './MonthSwitcher'

describe('MonthSwitcher', () => {
  it('renders the current month label', () => {
    render(<MonthSwitcher monthId="2026-08" onChange={vi.fn()} />)
    expect(screen.getByText('August 2026')).toBeInTheDocument()
  })

  it('calls onChange with the previous month when the back arrow is clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<MonthSwitcher monthId="2026-08" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /previous month/i }))
    expect(onChange).toHaveBeenCalledWith('2026-07')
  })

  it('calls onChange with the next month when the forward arrow is clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<MonthSwitcher monthId="2026-08" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /next month/i }))
    expect(onChange).toHaveBeenCalledWith('2026-09')
  })

  it('handles crossing a year boundary', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<MonthSwitcher monthId="2026-01" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /previous month/i }))
    expect(onChange).toHaveBeenCalledWith('2025-12')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/components/ledger/MonthSwitcher.test.tsx`
Expected: FAIL — `./MonthSwitcher` module not found.

- [ ] **Step 3: Implement `src/components/ledger/MonthSwitcher.tsx`**

```tsx
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export interface MonthSwitcherProps {
  monthId: string
  onChange: (monthId: string) => void
}

function shiftMonth(monthId: string, delta: number): string {
  const [year, month] = monthId.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function MonthSwitcher({ monthId, onChange }: MonthSwitcherProps) {
  const [year, month] = monthId.split('-').map(Number)
  const label = `${MONTH_LABELS[month - 1]} ${year}`

  return (
    <div className="flex items-center gap-3">
      <button type="button" aria-label="Previous month" onClick={() => onChange(shiftMonth(monthId, -1))}>
        ←
      </button>
      <span className="font-mono text-sm min-w-[9ch] text-center">{label}</span>
      <button type="button" aria-label="Next month" onClick={() => onChange(shiftMonth(monthId, 1))}>
        →
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/components/ledger/MonthSwitcher.test.tsx`
Expected: PASS — 4 tests passed.

- [ ] **Step 5: Implement `src/components/ledger/EmptyState.tsx`** (not unit tested — trivial presentational wrapper, covered visually in manual QA)

```tsx
export interface EmptyStateProps {
  message: string
  actionLabel: string
  onAction: () => void
}

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center text-ink-soft">
      <p>{message}</p>
      <button type="button" onClick={onAction} className="bg-brass text-paper px-4 py-2 rounded font-medium">
        {actionLabel}
      </button>
    </div>
  )
}
```

- [ ] **Step 6: Implement the container `src/pages/DashboardPage.tsx`** (not unit tested — wires Firestore hooks; verify manually per Step 7)

```tsx
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { AppShell } from '../components/layout/AppShell'
import { EmptyState } from '../components/ledger/EmptyState'
import { LedgerSection } from '../components/ledger/LedgerSection'
import { MonthSwitcher } from '../components/ledger/MonthSwitcher'
import { SummaryHero } from '../components/ledger/SummaryHero'
import { useCategories } from '../data/categories'
import { useCommitments } from '../data/commitments'
import { useMonth } from '../data/months'
import { computeCategorySubtotals, getMonthId } from '../lib/ledgerCalculations'

export default function DashboardPage() {
  const { user } = useAuth()
  const uid = user!.uid
  const navigate = useNavigate()
  const [monthId, setMonthId] = useState(() => getMonthId(new Date()))
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemAmount, setNewItemAmount] = useState('')
  const [newItemCategoryId, setNewItemCategoryId] = useState('')
  const [newItemDescription, setNewItemDescription] = useState('')

  const { categories, loading: categoriesLoading } = useCategories(uid)
  const { commitments, loading: commitmentsLoading } = useCommitments(uid)
  const {
    month,
    loading: monthLoading,
    setSalary,
    toggleItemStatus,
    updateItemAmount,
    addOneOffItem,
  } = useMonth(uid, monthId, commitments)

  if (categoriesLoading || commitmentsLoading || monthLoading) {
    return (
      <AppShell>
        <p className="text-ink-soft">Loading…</p>
      </AppShell>
    )
  }

  if (categories.length === 0 || commitments.length === 0) {
    return (
      <AppShell>
        <EmptyState
          message="Add your first category and commitment to start tracking this month."
          actionLabel="Go to commitments"
          onAction={() => navigate('/commitments')}
        />
      </AppShell>
    )
  }

  const items = month?.items ?? []
  const subtotals = computeCategorySubtotals(items)

  async function handleAddOneOff(event: FormEvent) {
    event.preventDefault()
    await addOneOffItem({
      name: newItemName,
      amount: Number(newItemAmount),
      categoryId: newItemCategoryId || categories[0].id,
      description: newItemDescription,
    })
    setNewItemName('')
    setNewItemAmount('')
    setNewItemDescription('')
    setShowAddItem(false)
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg">This Month</h2>
          <MonthSwitcher monthId={monthId} onChange={setMonthId} />
        </div>
        <SummaryHero salary={month?.salary ?? 0} items={items} />
        <label className="flex justify-between items-center py-3 text-sm border-b border-line">
          <span className="text-ink-soft">Edit salary</span>
          <input
            type="number"
            defaultValue={month?.salary ?? 0}
            onBlur={(event) => setSalary(Number(event.target.value))}
            className="font-mono border border-line rounded px-2 py-1 w-32 text-right bg-paper"
          />
        </label>
        {categories.map((category) => (
          <LedgerSection
            key={category.id}
            categoryName={category.name}
            items={items.filter((item) => item.categoryId === category.id)}
            subtotal={subtotals[category.id] ?? 0}
            onToggleStatus={toggleItemStatus}
            onAmountChange={updateItemAmount}
          />
        ))}

        <div className="pt-4">
          {!showAddItem ? (
            <button type="button" onClick={() => setShowAddItem(true)} className="text-sm text-brass font-medium">
              + Add one-off expense
            </button>
          ) : (
            <form onSubmit={handleAddOneOff} className="flex flex-col gap-2 border border-line rounded p-4 mt-2">
              <input
                aria-label="One-off item name"
                placeholder="What's this for?"
                value={newItemName}
                onChange={(event) => setNewItemName(event.target.value)}
                required
                className="border border-line rounded px-2 py-1 bg-paper text-sm"
              />
              <div className="flex gap-2">
                <input
                  aria-label="One-off item amount"
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={newItemAmount}
                  onChange={(event) => setNewItemAmount(event.target.value)}
                  required
                  className="border border-line rounded px-2 py-1 bg-paper text-sm w-28 font-mono"
                />
                <select
                  aria-label="One-off item category"
                  value={newItemCategoryId || categories[0].id}
                  onChange={(event) => setNewItemCategoryId(event.target.value)}
                  className="border border-line rounded px-2 py-1 bg-paper text-sm flex-1"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                aria-label="One-off item description"
                placeholder="Description (optional)"
                value={newItemDescription}
                onChange={(event) => setNewItemDescription(event.target.value)}
                className="border border-line rounded px-2 py-1 bg-paper text-sm"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddItem(false)} className="px-3 py-1.5 text-sm">
                  Cancel
                </button>
                <button type="submit" className="bg-brass text-paper px-3 py-1.5 rounded text-sm">
                  Add expense
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  )
}
```

- [ ] **Step 7: Manually verify the full dashboard flow**

Run `npm run dev`, sign in, and confirm: categories render as sections with correct subtotals; clicking a stamp toggles PAID/PENDING and persists (reload the page to confirm); editing an individual item's amount persists (blur the field, reload to confirm); editing the salary field persists; adding a one-off expense creates it with a "one-off" badge in the right category, persists after reload, and does not appear in Manage Commitments (Task 15) since it was never added to the template; the month switcher moves between months and each new month clones current commitments as PENDING; the empty state appears for a fresh account with no categories/commitments yet.

- [ ] **Step 8: Commit**

```bash
git add src/pages/DashboardPage.tsx src/components/ledger/MonthSwitcher.tsx src/components/ledger/MonthSwitcher.test.tsx src/components/ledger/EmptyState.tsx
git commit -m "feat: build dashboard page with ledger sections and month switching"
```

---

## Task 15: Manage Commitments Page

**Files:**
- Modify: `src/pages/CommitmentsPage.tsx`
- Create: `src/components/commitments/CategoryManager.tsx`
- Create: `src/components/commitments/CategoryManager.test.tsx`
- Create: `src/components/commitments/CommitmentForm.tsx`
- Create: `src/components/commitments/CommitmentForm.test.tsx`
- Create: `src/components/commitments/ConfirmDialog.tsx`
- Create: `src/components/commitments/ConfirmDialog.test.tsx`

**Interfaces:**
- Consumes: `useCategories` (Task 11, including `reorderCategories` — wired here since no other task uses it), `useCommitments` (Task 12), `EmptyState` (Task 14).
- Produces: `CategoryManager` props `{ categories: Category[]; onAdd: (name: string) => void; onRename: (id: string, name: string) => void; onDelete: (id: string) => void; onReorder: (orderedIds: string[]) => void }`; `CommitmentForm` props `{ categories: Category[]; initial?: Partial<Commitment>; onSubmit: (input: Omit<Commitment, 'id'>) => void; onCancel: () => void }`; `ConfirmDialog` props `{ open: boolean; message: string; onConfirm: () => void; onCancel: () => void }`.

- [ ] **Step 1: Write the failing tests — `src/components/commitments/ConfirmDialog.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    render(<ConfirmDialog open={false} message="Delete this?" onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.queryByText('Delete this?')).not.toBeInTheDocument()
  })

  it('renders the message when open', () => {
    render(<ConfirmDialog open={true} message="Delete this?" onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Delete this?')).toBeInTheDocument()
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmDialog open={true} message="Delete this?" onConfirm={onConfirm} onCancel={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmDialog open={true} message="Delete this?" onConfirm={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/components/commitments/ConfirmDialog.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/commitments/ConfirmDialog.tsx`**

```tsx
export interface ConfirmDialogProps {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50">
      <div className="bg-paper border border-line rounded p-6 max-w-sm w-full">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="bg-stamp-red text-paper px-3 py-1.5 rounded text-sm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/components/commitments/ConfirmDialog.test.tsx`
Expected: PASS — 4 tests passed.

- [ ] **Step 5: Write the failing tests — `src/components/commitments/CategoryManager.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CategoryManager } from './CategoryManager'
import type { Category } from '../../types/models'

const categories: Category[] = [
  { id: 'cat1', name: 'Bank Loans', sortOrder: 0 },
  { id: 'cat2', name: 'Bills', sortOrder: 1 },
]

describe('CategoryManager', () => {
  it('renders each category name', () => {
    render(<CategoryManager categories={categories} onAdd={vi.fn()} onRename={vi.fn()} onDelete={vi.fn()} onReorder={vi.fn()} />)
    expect(screen.getByText('Bank Loans')).toBeInTheDocument()
    expect(screen.getByText('Bills')).toBeInTheDocument()
  })

  it('calls onAdd with the typed name when the add form is submitted', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<CategoryManager categories={categories} onAdd={onAdd} onRename={vi.fn()} onDelete={vi.fn()} onReorder={vi.fn()} />)
    await user.type(screen.getByLabelText(/new category/i), 'Insurances')
    await user.click(screen.getByRole('button', { name: /add category/i }))
    expect(onAdd).toHaveBeenCalledWith('Insurances')
  })

  it('calls onDelete with the category id when its delete button is clicked', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<CategoryManager categories={categories} onAdd={vi.fn()} onRename={vi.fn()} onDelete={onDelete} onReorder={vi.fn()} />)
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0])
    expect(onDelete).toHaveBeenCalledWith('cat1')
  })

  it('calls onReorder with the swapped id order when moving a category down', async () => {
    const onReorder = vi.fn()
    const user = userEvent.setup()
    render(<CategoryManager categories={categories} onAdd={vi.fn()} onRename={vi.fn()} onDelete={vi.fn()} onReorder={onReorder} />)
    await user.click(screen.getAllByRole('button', { name: /move down/i })[0])
    expect(onReorder).toHaveBeenCalledWith(['cat2', 'cat1'])
  })

  it('disables moving the first category up and the last category down', () => {
    render(<CategoryManager categories={categories} onAdd={vi.fn()} onRename={vi.fn()} onDelete={vi.fn()} onReorder={vi.fn()} />)
    const upButtons = screen.getAllByRole('button', { name: /move up/i })
    const downButtons = screen.getAllByRole('button', { name: /move down/i })
    expect(upButtons[0]).toBeDisabled()
    expect(downButtons[downButtons.length - 1]).toBeDisabled()
  })
})
```

- [ ] **Step 6: Run tests to verify they fail**

Run: `npm run test:run -- src/components/commitments/CategoryManager.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `src/components/commitments/CategoryManager.tsx`**

```tsx
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
          <input
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
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `npm run test:run -- src/components/commitments/CategoryManager.test.tsx`
Expected: PASS — 5 tests passed.

- [ ] **Step 9: Write the failing tests — `src/components/commitments/CommitmentForm.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CommitmentForm } from './CommitmentForm'
import type { Category } from '../../types/models'

const categories: Category[] = [{ id: 'cat1', name: 'Bank Loans', sortOrder: 0 }]

describe('CommitmentForm', () => {
  it('submits the entered values', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<CommitmentForm categories={categories} onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText(/name/i), 'Car')
    await user.type(screen.getByLabelText(/amount/i), '599')
    await user.selectOptions(screen.getByLabelText(/category/i), 'cat1')
    await user.type(screen.getByLabelText(/description/i), 'Ambank')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Car',
      amount: 599,
      categoryId: 'cat1',
      description: 'Ambank',
      active: true,
    })
  })

  it('calls onCancel when cancel is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<CommitmentForm categories={categories} onSubmit={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })
})
```

- [ ] **Step 10: Run tests to verify they fail**

Run: `npm run test:run -- src/components/commitments/CommitmentForm.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 11: Implement `src/components/commitments/CommitmentForm.tsx`**

```tsx
import { useState, type FormEvent } from 'react'
import type { Category, Commitment } from '../../types/models'

export interface CommitmentFormProps {
  categories: Category[]
  initial?: Partial<Commitment>
  onSubmit: (input: Omit<Commitment, 'id'>) => void
  onCancel: () => void
}

export function CommitmentForm({ categories, initial, onSubmit, onCancel }: CommitmentFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [amount, setAmount] = useState(String(initial?.amount ?? ''))
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit({ name, amount: Number(amount), categoryId, description, active: true })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} required className="border border-line rounded px-2 py-1 bg-paper" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Amount
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
          className="border border-line rounded px-2 py-1 bg-paper"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Category
        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="border border-line rounded px-2 py-1 bg-paper">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Description
        <input value={description} onChange={(event) => setDescription(event.target.value)} className="border border-line rounded px-2 py-1 bg-paper" />
      </label>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm">
          Cancel
        </button>
        <button type="submit" className="bg-paid text-paper px-3 py-1.5 rounded text-sm">
          Save
        </button>
      </div>
    </form>
  )
}
```

- [ ] **Step 12: Run tests to verify they pass**

Run: `npm run test:run -- src/components/commitments/CommitmentForm.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 13: Implement the container `src/pages/CommitmentsPage.tsx`** (not unit tested — wires Firestore hooks; verify manually per Step 14)

```tsx
import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { AppShell } from '../components/layout/AppShell'
import { CategoryManager } from '../components/commitments/CategoryManager'
import { CommitmentForm } from '../components/commitments/CommitmentForm'
import { ConfirmDialog } from '../components/commitments/ConfirmDialog'
import { EmptyState } from '../components/ledger/EmptyState'
import { useCategories } from '../data/categories'
import { useCommitments } from '../data/commitments'
import type { Commitment } from '../types/models'

export default function CommitmentsPage() {
  const { user } = useAuth()
  const uid = user!.uid
  const { categories, addCategory, renameCategory, deleteCategory, reorderCategories } = useCategories(uid)
  const { commitments, addCommitment, updateCommitment, deleteCommitment } = useCommitments(uid)
  const [editing, setEditing] = useState<Commitment | 'new' | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <section>
          <h2 className="font-display text-lg mb-3">Categories</h2>
          <CategoryManager
            categories={categories}
            onAdd={addCategory}
            onRename={renameCategory}
            onDelete={deleteCategory}
            onReorder={reorderCategories}
          />
        </section>

        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-display text-lg">Recurring Commitments</h2>
            {categories.length > 0 && (
              <button type="button" onClick={() => setEditing('new')} className="bg-brass text-paper px-3 py-1 rounded text-sm">
                Add commitment
              </button>
            )}
          </div>

          {categories.length === 0 ? (
            <EmptyState message="Add a category first." actionLabel="Scroll up" onAction={() => {}} />
          ) : (
            commitments.map((commitment) => (
              <div key={commitment.id} className="flex justify-between items-center py-1.5 border-t border-line first:border-t-0">
                <span>
                  {commitment.name}
                  <span className="block text-xs text-ink-soft">RM {commitment.amount.toFixed(2)}</span>
                </span>
                <span className="flex gap-3 text-sm">
                  <button type="button" onClick={() => setEditing(commitment)}>Edit</button>
                  <button type="button" onClick={() => setPendingDeleteId(commitment.id)} className="text-stamp-red">Delete</button>
                </span>
              </div>
            ))
          )}

          {editing && (
            <div className="mt-4">
              <CommitmentForm
                categories={categories}
                initial={editing === 'new' ? undefined : editing}
                onCancel={() => setEditing(null)}
                onSubmit={async (input) => {
                  if (editing === 'new') await addCommitment(input)
                  else await updateCommitment(editing.id, input)
                  setEditing(null)
                }}
              />
            </div>
          )}
        </section>

        <ConfirmDialog
          open={pendingDeleteId !== null}
          message="Delete this commitment? Past months already generated won't be affected."
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={async () => {
            if (pendingDeleteId) await deleteCommitment(pendingDeleteId)
            setPendingDeleteId(null)
          }}
        />
      </div>
    </AppShell>
  )
}
```

- [ ] **Step 14: Manually verify the full commitments management flow**

Run `npm run dev`, sign in, and confirm: adding, renaming, reordering (↑/↓), and deleting a category works and reflects immediately, including the new order persisting after a page reload; adding, editing, and deleting a commitment works; deleting a commitment prompts the confirm dialog and, after confirming, doesn't remove it from an already-generated month snapshot (check the Dashboard for the current month still shows it).

- [ ] **Step 15: Commit**

```bash
git add src/pages/CommitmentsPage.tsx src/components/commitments/
git commit -m "feat: build manage commitments page with category and commitment CRUD"
```

---

## Task 16: Charts & History Page

**Files:**
- Create: `src/lib/chartData.ts`
- Create: `src/lib/chartData.test.ts`
- Create: `src/components/charts/CategoryBreakdownChart.tsx`
- Create: `src/components/charts/MonthTrendChart.tsx`
- Modify: `src/pages/HistoryPage.tsx`

**Interfaces:**
- Consumes: `computeCategorySubtotals`, `computeTotalCommitted` (Task 3), `MonthDoc`/`Category` types (Task 3), `useMonthsHistory` (Task 13), `useCategories` (Task 11).
- Produces: `buildCategoryBreakdownData(items: LineItem[], categories: Category[]): { name: string; value: number }[]`, `buildMonthTrendData(months: MonthDoc[]): { month: string; salary: number; committed: number; remaining: number }[]` — consumed by the chart components and unit tested directly; chart components themselves receive pre-built data and are manually verified (Recharts + jsdom rendering is unreliable in automated tests).

- [ ] **Step 1: Write the failing tests — `src/lib/chartData.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { buildCategoryBreakdownData, buildMonthTrendData } from './chartData'
import type { Category, LineItem, MonthDoc } from '../types/models'

const categories: Category[] = [
  { id: 'loans', name: 'Bank Loans', sortOrder: 0 },
  { id: 'bills', name: 'Bills', sortOrder: 1 },
]

const items: LineItem[] = [
  { id: 'c1', name: 'Car', categoryId: 'loans', amount: 599, description: '', status: 'PAID', isOneOff: false },
  { id: 'c2', name: 'Electricity', categoryId: 'bills', amount: 142.85, description: '', status: 'PAID', isOneOff: false },
]

describe('buildCategoryBreakdownData', () => {
  it('maps category ids to names with summed amounts', () => {
    expect(buildCategoryBreakdownData(items, categories)).toEqual([
      { name: 'Bank Loans', value: 599 },
      { name: 'Bills', value: 142.85 },
    ])
  })

  it('skips categories with no items', () => {
    expect(buildCategoryBreakdownData([items[0]], categories)).toEqual([{ name: 'Bank Loans', value: 599 }])
  })
})

describe('buildMonthTrendData', () => {
  it('computes salary, committed, and remaining per month, sorted by month id', () => {
    const months: MonthDoc[] = [
      { id: '2026-08', salary: 6500, items },
      { id: '2026-06', salary: 6000, items: [items[0]] },
    ]
    expect(buildMonthTrendData(months)).toEqual([
      { month: '2026-06', salary: 6000, committed: 599, remaining: 5401 },
      { month: '2026-08', salary: 6500, committed: 741.85, remaining: 5758.15 },
    ])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/lib/chartData.test.ts`
Expected: FAIL — `./chartData` module not found.

- [ ] **Step 3: Implement `src/lib/chartData.ts`**

```ts
import { computeCategorySubtotals, computeRemainingBalance, computeTotalCommitted } from './ledgerCalculations'
import type { Category, LineItem, MonthDoc } from '../types/models'

export function buildCategoryBreakdownData(items: LineItem[], categories: Category[]) {
  const subtotals = computeCategorySubtotals(items)
  return categories
    .filter((category) => subtotals[category.id] !== undefined)
    .map((category) => ({ name: category.name, value: subtotals[category.id] }))
}

export function buildMonthTrendData(months: MonthDoc[]) {
  return [...months]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((month) => ({
      month: month.id,
      salary: month.salary,
      committed: computeTotalCommitted(month.items),
      remaining: computeRemainingBalance(month.salary, month.items),
    }))
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/lib/chartData.test.ts`
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Implement `src/components/charts/CategoryBreakdownChart.tsx`** (not unit tested — see task rationale; verify manually per Step 8)

```tsx
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface CategoryBreakdownChartProps {
  data: { name: string; value: number }[]
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid stroke="var(--line)" horizontal={false} />
        <XAxis type="number" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
        <YAxis type="category" dataKey="name" tick={{ fontFamily: 'IBM Plex Sans', fontSize: 12 }} width={110} />
        <Tooltip formatter={(value: number) => `RM ${value.toFixed(2)}`} />
        <Bar dataKey="value" fill="var(--brass)" radius={[0, 3, 3, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 6: Implement `src/components/charts/MonthTrendChart.tsx`** (not unit tested — see task rationale; verify manually per Step 8)

```tsx
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface MonthTrendChartProps {
  data: { month: string; salary: number; committed: number; remaining: number }[]
}

export function MonthTrendChart({ data }: MonthTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid stroke="var(--line)" />
        <XAxis dataKey="month" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
        <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
        <Tooltip formatter={(value: number) => `RM ${value.toFixed(2)}`} />
        <Line type="monotone" dataKey="salary" stroke="var(--ink-soft)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="committed" stroke="var(--stamp-red)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="remaining" stroke="var(--paid)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 7: Implement the container `src/pages/HistoryPage.tsx`** (not unit tested — wires Firestore hooks; verify manually per Step 8)

```tsx
import { useAuth } from '../auth/useAuth'
import { AppShell } from '../components/layout/AppShell'
import { CategoryBreakdownChart } from '../components/charts/CategoryBreakdownChart'
import { MonthTrendChart } from '../components/charts/MonthTrendChart'
import { useCategories } from '../data/categories'
import { useMonthsHistory } from '../data/months'
import { buildCategoryBreakdownData, buildMonthTrendData } from '../lib/chartData'

export default function HistoryPage() {
  const { user } = useAuth()
  const uid = user!.uid
  const { categories } = useCategories(uid)
  const { months } = useMonthsHistory(uid)

  const trendData = buildMonthTrendData(months)
  const latestMonth = [...months].sort((a, b) => b.id.localeCompare(a.id))[0]
  const breakdownData = latestMonth ? buildCategoryBreakdownData(latestMonth.items, categories) : []

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <section>
          <h2 className="font-display text-lg mb-3">Month over month</h2>
          <MonthTrendChart data={trendData} />
        </section>
        <section>
          <h2 className="font-display text-lg mb-3">Latest month by category</h2>
          <CategoryBreakdownChart data={breakdownData} />
        </section>
        <section>
          <h2 className="font-display text-lg mb-3">Past months</h2>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-left text-ink-soft border-b border-line">
                <th className="py-1">Month</th>
                <th className="py-1">Salary</th>
                <th className="py-1">Committed</th>
                <th className="py-1">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((row) => (
                <tr key={row.month} className="border-b border-line">
                  <td className="py-1">{row.month}</td>
                  <td className="py-1">RM {row.salary.toFixed(2)}</td>
                  <td className="py-1">RM {row.committed.toFixed(2)}</td>
                  <td className="py-1">RM {row.remaining.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppShell>
  )
}
```

- [ ] **Step 8: Manually verify the history page**

Run `npm run dev` with at least two months of data generated (visit Dashboard, switch months to generate snapshots, set salaries, mark some items paid). Confirm the trend chart plots each month, the category breakdown chart shows the latest month's subtotals, and the table lists all months sorted correctly.

- [ ] **Step 9: Commit**

```bash
git add src/lib/chartData.ts src/lib/chartData.test.ts src/components/charts/ src/pages/HistoryPage.tsx
git commit -m "feat: add month trend and category breakdown charts to history page"
```

---

## Task 17: Offline Sync Indicator

**Files:**
- Create: `src/lib/useOnlineStatus.ts`
- Create: `src/lib/useOnlineStatus.test.ts`
- Create: `src/components/layout/SyncIndicator.tsx`
- Create: `src/components/layout/SyncIndicator.test.tsx`
- Modify: `src/components/layout/AppShell.tsx`

**Interfaces:**
- Produces: `useOnlineStatus(): boolean`; `SyncIndicator` component, props `{ isOnline: boolean }` — consumed by `AppShell` (Task 6).

This implements the spec's "syncing…" indicator (spec: Error Handling & Edge Cases) as an online/offline banner — the simplest reliable signal available without wiring per-write pending-state tracking through every Firestore hook.

- [ ] **Step 1: Write the failing test — `src/lib/useOnlineStatus.test.ts`**

```ts
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useOnlineStatus } from './useOnlineStatus'

describe('useOnlineStatus', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with navigator.onLine', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)
  })

  it('flips to false when the offline event fires', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
    const { result } = renderHook(() => useOnlineStatus())
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    expect(result.current).toBe(false)
  })

  it('flips back to true when the online event fires', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const { result } = renderHook(() => useOnlineStatus())
    act(() => {
      window.dispatchEvent(new Event('online'))
    })
    expect(result.current).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run -- src/lib/useOnlineStatus.test.ts`
Expected: FAIL — `./useOnlineStatus` module not found.

- [ ] **Step 3: Implement `src/lib/useOnlineStatus.ts`**

```ts
import { useEffect, useState } from 'react'

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:run -- src/lib/useOnlineStatus.test.ts`
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Write the failing test — `src/components/layout/SyncIndicator.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SyncIndicator } from './SyncIndicator'

describe('SyncIndicator', () => {
  it('renders nothing when online', () => {
    const { container } = render(<SyncIndicator isOnline={true} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows an offline message when offline', () => {
    render(<SyncIndicator isOnline={false} />)
    expect(screen.getByText(/offline/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm run test:run -- src/components/layout/SyncIndicator.test.tsx`
Expected: FAIL — `./SyncIndicator` module not found.

- [ ] **Step 7: Implement `src/components/layout/SyncIndicator.tsx`**

```tsx
export function SyncIndicator({ isOnline }: { isOnline: boolean }) {
  if (isOnline) return null
  return (
    <div className="bg-stamp-red text-paper text-xs text-center py-1">
      Offline — changes will sync when you're back online
    </div>
  )
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm run test:run -- src/components/layout/SyncIndicator.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 9: Wire `SyncIndicator` into `AppShell`**

In `src/components/layout/AppShell.tsx`, add the import and render it above the header:

```tsx
import { useOnlineStatus } from '../../lib/useOnlineStatus'
import { SyncIndicator } from './SyncIndicator'
```

Add inside the component, before the returned JSX's outer `<div>` content:

```tsx
const isOnline = useOnlineStatus()
```

And as the first child of the outer `<div className="min-h-screen ...">`:

```tsx
<SyncIndicator isOnline={isOnline} />
```

- [ ] **Step 10: Run the full test suite**

Run: `npm run test:run`
Expected: PASS — all tests pass, including the new ones.

- [ ] **Step 11: Manually verify**

Run `npm run dev`, open dev tools' Network tab, set throttling to "Offline". Confirm the red banner appears. Set back to "Online" (or "No throttling"). Confirm the banner disappears.

- [ ] **Step 12: Commit**

```bash
git add src/lib/useOnlineStatus.ts src/lib/useOnlineStatus.test.ts src/components/layout/SyncIndicator.tsx src/components/layout/SyncIndicator.test.tsx src/components/layout/AppShell.tsx
git commit -m "feat: add offline sync indicator"
```

---

## Task 18: Responsive & Dark Mode QA Pass

**Files:**
- Modify: any component files where issues are found during manual QA (most likely `AppShell.tsx`, `SummaryHero.tsx`, `LedgerSection.tsx`)

**Interfaces:**
- No new interfaces — this task fixes visual issues found in already-built components.

This task is manual QA, not new automated tests — the components under review are already unit tested for behavior; this pass checks visual/responsive correctness which automated component tests don't cover.

- [ ] **Step 1: Check mobile layout (~360-390px width)**

Run `npm run dev`, open browser dev tools, set viewport to 375×667. Confirm: header nav wraps or collapses sensibly, hero numbers don't overflow, category sections and line items stay readable with right-aligned amounts not clipped, the confirm dialog and forms fit within the viewport without horizontal scroll.

- [ ] **Step 2: Check tablet/desktop layout (768px, 1280px)**

Confirm the `max-w-2xl mx-auto` content column looks intentional (not too narrow/wide) at both sizes, and the header nav lays out horizontally with room to spare.

- [ ] **Step 3: Check dark mode across every page**

Toggle dark mode from `AppShell` and visit Dashboard, Commitments, and History. Confirm all text remains readable (sufficient contrast against `--paper`/`--ink` dark tokens), the PAID/PENDING stamp colors (`--paid`/`--stamp-red` dark variants) stay legible, and chart colors (which read CSS variables via `var(--brass)` etc.) update correctly — note: Recharts reads CSS custom properties at render time, so toggling dark mode may require the chart to re-render; if colors don't update live, pass the resolved theme down as a prop instead of relying on the CSS variable so Recharts re-renders with the new value.

- [ ] **Step 4: Check keyboard focus visibility**

Tab through the login form, dashboard stamps, and commitments forms. Confirm every interactive element (buttons, inputs, links) shows a visible focus outline (Tailwind's default focus ring is sufficient — add `focus-visible:ring-2 focus-visible:ring-brass` to any custom button/stamp classes that suppress the browser default).

- [ ] **Step 5: Fix any issues found, then re-run the full test suite**

Run: `npm run test:run`
Expected: PASS — all previously passing tests still pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "fix: responsive, dark mode, and keyboard focus polish"
```

(If Steps 1-4 found no issues, skip this task's commit — nothing to commit.)

---

## Task 19: GitHub Pages Deployment

**Files:**
- Modify: `README.md`
- Verify: `vite.config.ts` (`base: './'` already set in Task 1)

**Interfaces:**
- No new interfaces — this task documents and automates deployment of the already-built app.

- [ ] **Step 1: Create `README.md`**

```markdown
# Finance Ledger

A monthly finance tracker: salary vs. recurring commitments (loans, bills,
insurance, family/discretionary spending), built with React, TypeScript,
Tailwind, and Firebase.

## Setup

1. Create a Firebase project at https://console.firebase.google.com.
2. Enable **Authentication** → Email/Password and Google sign-in providers.
3. Create a **Firestore** database (production mode).
4. Copy `.env.example` to `.env` and fill in your Firebase project's web app config values.
5. `npm install`
6. `npm run dev`

## Testing

`npm run test` (watch mode) or `npm run test:run` (single run).

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. `npm run deploy` — builds the app and publishes `dist/` to the `gh-pages` branch via the `gh-pages` package.
3. In the GitHub repo settings, under **Pages**, set the source to the `gh-pages` branch.
4. The app uses `HashRouter`, so all routes work correctly on GitHub Pages without server-side rewrite rules.
```

- [ ] **Step 2: Verify the production build one more time**

Run: `npm run build && npm run preview`
Expected: `npm run preview` serves the built app locally; confirm it loads and routes work when navigating via the hash (`/#/dashboard` etc.).

- [ ] **Step 3: Deploy**

Run: `npm run deploy`
Expected: publishes to the `gh-pages` branch (requires the repo to have a `origin` remote already configured — confirm with the user before running if it's not set up yet).

- [ ] **Step 4: Commit the README**

```bash
git add README.md
git commit -m "docs: add setup and deployment instructions"
```

---

## Final Verification

- [ ] Run the full test suite once more: `npm run test:run` — all tests pass.
- [ ] Run `npm run typecheck` — no type errors.
- [ ] Run `npm run build` — succeeds.
- [ ] Manually walk through: sign up/sign in → add categories → add commitments → dashboard shows current month → toggle a few PAID stamps → switch months → edit salary → view history charts → toggle dark mode → check on a narrow mobile viewport.
