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
      'Missing VITE_WEB3FORMS_ACCESS_KEY. In Netlify: Site configuration → Environment variables → add VITE_WEB3FORMS_ACCESS_KEY (value from web3forms.com), ensure it applies to Production, save, then Deploys → Clear cache and deploy.',
    )
  }

  return {
    plugins: [react(), tailwindcss()],
  }
})
