const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export type Settings = {
  logger: "none" | "dev" | "prod";
};

const settings: Settings = {
  logger: isDevelopment ? "dev" : "none",
};

export default settings;
