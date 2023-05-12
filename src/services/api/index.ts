import { once } from "ramda";
import { settings } from "settings";

import { DataStore } from "./types";
import { APIService } from "./api";

export * from "./types";

export const getDataStore = once(
  (): DataStore => new APIService(settings.apiURL),
);
