/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: "development" | "production" | "test";
  readonly VITE_BASE_PATH: string;
  readonly VITE_API_URL: string;
  readonly VITE_ENABLE_GUEST: string;

  readonly VITE_GITHUB_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
