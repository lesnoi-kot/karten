const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export type Settings = {
  logger: "none" | "dev" | "prod";
  reduxDevToolsEnabled: boolean;
};

export const settings: Settings = {
  logger: isDevelopment ? "dev" : "none",
  reduxDevToolsEnabled: isDevelopment ? true : false,
};
