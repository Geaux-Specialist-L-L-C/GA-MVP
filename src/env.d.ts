/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_DATABASE_URL: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_MAX_AUTH_RETRIES: string;
  readonly VITE_USE_SECURE_COOKIES: string;
  readonly VITE_AUTH_PERSISTENCE: string;
  readonly VITE_AUTH_POPUP_FALLBACK: string;
  readonly VITE_SERVICE_WORKER_TIMEOUT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}