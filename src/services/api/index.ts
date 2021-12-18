import { API } from "./types";
import MockAPI from "./mockAPI";

export { default as MockAPI } from "./mockAPI";

export * from "./types";

export function getAPI(): API {
  return new MockAPI("sadPoe");
}
