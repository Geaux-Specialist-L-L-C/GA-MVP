/// <reference lib="webworker" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_SERVICE_WORKER_TIMEOUT: string;
    readonly VITE_AUTH_SW_SCOPE: string;
    readonly VITE_AUTH_REQUIRE_SECURE: string;
    readonly VITE_MAX_AUTH_RETRIES: string;
    readonly VITE_AUTH_SW_PATH: string;
    readonly VITE_AUTH_EMULATOR_HOST: string;
    readonly VITE_AUTH_FORCE_REDIRECT: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};