const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export const settings = {
  logger: isDevelopment ? "dev" : "none",
  reduxDevToolsEnabled: Boolean(isDevelopment),
  apiURL: process.env.REACT_APP_API_URL,
  publicURL: process.env.PUBLIC_URL,
};
