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
