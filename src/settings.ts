export const settings = {
  logger: import.meta.env.DEV ? "dev" : "none",
  reduxDevToolsEnabled: import.meta.env.DEV,
  apiURL: import.meta.env.VITE_API_URL,
  baseURL: import.meta.env.BASE_PATH,
};
