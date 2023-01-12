const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export type Settings = {
  logger: "none" | "dev" | "prod";
  reduxDevToolsEnabled: boolean;
  apiURL: string;
};

export const settings: Settings = {
  logger: isDevelopment ? "dev" : "none",
  reduxDevToolsEnabled: Boolean(isDevelopment),
  // @ts-expect-error TODO: check in build time
  apiURL: process.env.REACT_APP_API_URL,
};
