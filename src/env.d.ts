/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHESHIRE_API_URL: string
  readonly VITE_CHESHIRE_ADMIN_PASSWORD: string
  readonly VITE_CHESHIRE_DEBUG: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
  readonly VITE_AZURE_ENDPOINT: string
  readonly TIPI_ENV: string
  readonly TIPI_PORT: string
  readonly TIPI_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}