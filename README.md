# Elk Novations — marketing site (React)

The parent folder (`elknovations`) contains only this project — the old static `index.html` and `assets/` copy were removed to avoid duplication.

## Contact form email (Web3Forms)

Submissions go to the inbox you use when creating a [Web3Forms](https://web3forms.com) access key (use **vusal.teymurov520@gmail.com** so leads arrive there).

1. Open [web3forms.com](https://web3forms.com), enter that email, and copy your **Access Key**.
2. In the `web` folder, create a file named `.env` (see `.env.example`):

   ```env
   VITE_WEB3FORMS_ACCESS_KEY=paste_your_key_here
   ```

3. Restart the dev server (`npm run dev`) or rebuild (`npm run build`).

**Security:** `.env` is listed in `.gitignore` — your access key must **never** be committed. If you rotate the key on Web3Forms, update only your local `.env` and the environment variables on your host (Netlify, Vercel, etc.); GitHub stays free of secrets.

### Netlify (`elknovations.netlify.app`)

The live site does **not** use your laptop’s `.env`. You must add the same variable in Netlify so Vite can embed it when building:

1. [Netlify](https://app.netlify.com) → your site → **Site configuration** → **Environment variables**.
2. **Add a variable**: name `VITE_WEB3FORMS_ACCESS_KEY`, value = your key from [web3forms.com](https://web3forms.com) (same as in local `.env`).
3. **Save**, then **Deploys** → **Trigger deploy** → **Clear cache and deploy site** (or push a commit so Netlify rebuilds).

Until this is set, the contact form on production will show a configuration message instead of sending.

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
