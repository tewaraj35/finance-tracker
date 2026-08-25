# Monthly Finance Tracker — Design Spec

Date: 2026-08-25

## Purpose

A personal web app to track monthly salary (which varies month to month)
against recurring commitments — bank loans, bills, insurance, family
expenses, and discretionary spending. Modeled on the user's existing
spreadsheet: categorized line items, each with an amount and a PAID/PENDING
status. Single user, private, accessible from any device.

## Tech Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for charts
- **Firebase**: Authentication (email/password + Google sign-in) and
  Firestore (database)
- **react-firebase-hooks** for Firebase state in React
- **React Router** with `HashRouter` (required for GitHub Pages, which has
  no server-side rewrites)
- **Vitest + React Testing Library** for unit tests
- **Deployment target**: GitHub Pages (static build); Firebase accessed
  client-side via SDK, so hosting location doesn't affect auth/DB.

## Data Model (Firestore)

All data scoped under `users/{uid}/...` so each authenticated user only
sees their own data.

### `categories`
User-defined groups for organizing commitments (e.g. "Bank Loans",
"Bills", "Insurances"). Fully customizable — add, rename, reorder, delete.

```
{ id, name, sortOrder }
```

### `commitments` (recurring template)
The master list of recurring monthly commitments. Editing this does not
retroactively change past month snapshots.

```
{ id, name, categoryId, amount, description, active }
```

### `months` (snapshots)
One document per calendar month (`YYYY-MM` as doc ID), generated on
first visit to that month by cloning current active `commitments`. Each
line item within a snapshot can be edited independently (amount override,
status) without affecting the template. One-off items (not in the
template) can be added directly to a month's snapshot.

```
{
  id, // "2026-08"
  salary,
  items: [
    { id, name, categoryId, amount, description, status: "PAID" | "PENDING", isOneOff }
  ]
}
```

### Derived (computed client-side, not stored)
- Total committed = sum of item amounts in current month
- Remaining balance = salary − total committed
- Paid vs. pending totals
- Category subtotals
- Month-over-month history (pulled from `months` collection)

## App Structure & Routing

`HashRouter` routes:

- `#/login` — Firebase Auth (email/password + Google sign-in)
- `#/dashboard` — current month's ledger (default authenticated route)
- `#/commitments` — manage recurring template (commitments + categories)
- `#/history` — month-over-month trends and past months table

A protected-route wrapper redirects unauthenticated users to `#/login`.

### Key components
- `AuthProvider` / `useAuth` — Firebase auth state
- `MonthProvider` — loads or generates the current month snapshot,
  exposes it + mutators
- `SummaryHero` — salary / committed / remaining, big mono numerals
- `LedgerSection` — one category's line items with subtotal
- `LineItem` — single commitment row (name, description, amount, stamp)
- `PaidStamp` — the signature rubber-stamp status indicator
- Chart components (Recharts) — category breakdown, month-over-month trend

## Visual Design

**Concept: "Ledger"** — grounded in the user's own bank-passbook and
statement data rather than a generic dashboard. Approved via visual
mockup during brainstorming.

### Palette (light)
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F2F5EC` | Page/card background (ledger paper) |
| `--ink` | `#1F3B2C` | Primary text |
| `--ink-soft` | `#5C7268` | Secondary text, labels, rules |
| `--brass` | `#B8863B` | Accents, progress fill, active states |
| `--stamp-red` | `#B23A2E` | Pending status, alerts |
| `--paid` | `#2F6B4F` | Paid status, positive balance |
| `--line` | `#D3DCC9` | Hairline rules/borders |

### Palette (dark)
| Token | Hex |
|---|---|
| `--paper` | `#14201A` |
| `--ink` | `#E9EFE6` |
| `--ink-soft` | `#8FA396` |
| `--brass` | `#D9A857` |
| `--stamp-red` | `#E2645A` |
| `--paid` | `#5FBE8D` |
| `--line` | `#2A382F` |

Dark mode follows system preference (`prefers-color-scheme`) with a
manual toggle override, persisted in local storage.

### Typography
- **Display** (`Fraunces`) — headers, hero balance figures, section labels.
  Used sparingly for character.
- **Body** (`IBM Plex Sans`) — all UI text, descriptions.
- **Numerals/data** (`IBM Plex Mono`, tabular figures) — every currency
  amount, dates, month labels. Ensures columns of numbers align like a
  real ledger.

### Layout
Statement/ledger-style, not a card-grid dashboard: hairline rules between
line items, dashed rules within a category, right-aligned tabular
currency, category sections with subtotal headers. Hero summary at top
(salary / committed / remaining) in large mono figures with a slim
progress bar (paid vs. pending).

### Signature element
The **PAID stamp** — a rotated (−7°), bordered, monospace badge in
`--paid` green applied to paid items. Pending items show a dashed-border
placeholder in `--stamp-red`, visually "awaiting ink." Clicking a
pending item's stamp toggles it to PAID (the primary interaction on the
dashboard). This directly mirrors the Status column in the user's
original spreadsheet.

### Responsiveness
Mobile-first: single-column ledger that reflows category sections
vertically; hero summary stacks; touch targets sized for tapping the
stamp toggle. Tested down to ~360px width.

## Error Handling & Edge Cases

- Auth errors surface as plain-language inline messages on the login
  form, not raw Firebase error strings.
- New users see an empty state guiding them to create their first
  category/commitment before any month can be generated.
- Month snapshot generation is idempotent (doc ID = `YYYY-MM`), so
  revisiting a month never duplicates its line items.
- Firestore offline persistence handles brief network loss; a small
  "syncing…" indicator shows during pending writes.
- Deleting a template commitment does not alter already-generated month
  snapshots; deletion requires confirmation.

## Testing Approach

- **Unit tests** (Vitest + React Testing Library): total/remaining/
  subtotal calculations, month-snapshot generation logic, and component
  rendering (line item states, stamp toggle).
- No Firebase emulator/e2e suite for v1 — personal-scale app, manual
  verification against the Firebase console is sufficient. Can be added
  later if scope grows.

## Out of Scope (v1)
- Multi-currency support (RM/MYR only)
- Multi-user sharing/collaboration on the same data
- Budgeting/forecasting beyond simple remaining-balance math
- Native mobile app (responsive web only)
