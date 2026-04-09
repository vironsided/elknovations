/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional: override contact API URL (default `/api/contact`). */
  readonly VITE_CONTACT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
