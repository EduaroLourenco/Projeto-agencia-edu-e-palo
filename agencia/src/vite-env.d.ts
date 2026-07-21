/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZAP_COMMERCE_URL?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
