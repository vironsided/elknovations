# Elk Novations — marketing site (React)

The parent folder (`elknovations`) contains only this project — the old static `index.html` and `assets/` copy were removed to avoid duplication.

## Contact form (SMTP via serverless API)

The site **POST**s to `/api/contact` (a [Vercel Serverless Function](https://vercel.com/docs/functions)). The handler uses **Nodemailer** and your **SMTP** credentials. Image attachments are supported (no third-party form service required).

Set these in the **Vercel** project → **Settings** → **Environment variables** (Production). They are **server-only** — never prefixed with `VITE_`.

| Variable | Example | Purpose |
|----------|---------|---------|
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server |
| `SMTP_PORT` | `587` | Usually `587` (STARTTLS) or `465` (SSL) |
| `SMTP_SECURE` | `false` | `true` only for port 465 |
| `SMTP_USER` | your mailbox | Login |
| `SMTP_PASS` | app password | For Gmail: [App Password](https://support.google.com/accounts/answer/185833) |
| `CONTACT_TO_EMAIL` | inbox that receives leads | e.g. `vusal.teymurov520@gmail.com` |
| `SMTP_FROM` | optional | `"Elk Novations" <you@gmail.com>` — defaults to `SMTP_USER` |

Redeploy after saving. **Local:** plain `npm run dev` does not run Vercel functions — run `vercel dev` from the `web` folder, or test on the deployed URL.

**Static hosting only (e.g. Netlify without functions):** you must add an equivalent serverless function or host the API elsewhere; this repo targets Vercel for the contact API.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
