/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: string
  readonly VITE_FEATURE_DARK_MODE?: string
  readonly VITE_FEATURE_NOTIFICATIONS?: string
  readonly VITE_FEATURE_ANALYTICS?: string
  readonly VITE_PRINT_ENABLED?: string
  readonly VITE_PRINT_DEFAULT_WIDTH?: string
  readonly VITE_DEFAULT_PAGE_SIZE?: string
  readonly VITE_INVOICE_PAGE_SIZE?: string
  readonly VITE_API_TIMEOUT?: string
  readonly VITE_UPLOAD_TIMEOUT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
