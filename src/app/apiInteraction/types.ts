import { PayloadAction, AnyAction } from "@reduxjs/toolkit";

import { FetchState } from "utils/types";

export type RequestInfo = {
  state: FetchState;
  action: AnyAction;
  error: any;
};
export type WithRequestKey = { requestKey: string };
export type APIAction<T> = PayloadAction<T, string, WithRequestKey>;

export type WithError = {
  error: string;
};
