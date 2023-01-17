import { PayloadAction, AnyAction } from "@reduxjs/toolkit";

import { FetchState } from "utils/types";

export type RequestInfo = {
  state: FetchState;
  action: AnyAction;
  error?: string;
};
export type WithRequestKey = { requestKey: string };
export type APIAction<T> = PayloadAction<T, string, WithRequestKey>;
