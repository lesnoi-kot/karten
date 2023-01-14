import { RootState } from "app";
import { RequestInfo } from "./types";

export const selectRequestInfo = (
  state: RootState,
  requestKey: string,
): RequestInfo | null => state.apiInteraction.requestsInfo[requestKey] ?? null;
