import { settings } from "configs/settings";

import { API } from "./types";
import { APIService } from "./backend";

export { default as MockAPI } from "./mockAPI";
export * from "./types";

export function getAPI(): API {
  return new APIService(settings.apiURL);
}
