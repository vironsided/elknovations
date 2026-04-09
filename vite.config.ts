import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const key = String(
    env.VITE_WEB3FORMS_ACCESS_KEY ?? process.env.VITE_WEB3FORMS_ACCESS_KEY ?? '',
  ).trim()

  // Netlify injects env at build time; without this key the SPA ships empty and the contact form cannot send.
  if (mode === 'production' && !key) {
    throw new Error(
      'Missing VITE_WEB3FORMS_ACCESS_KEY. Add it in Vercel or Netlify → Environment variables (same value as web3forms.com), scope to Production, save, then redeploy.',
    )
  }

  return {
    plugins: [react(), tailwindcss()],
  }
})
