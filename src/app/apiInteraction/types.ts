import { PayloadAction, AnyAction } from "@reduxjs/toolkit";

import { FetchState } from "utils/types";

export type RequestInfo = {
  state: FetchState;
  action: AnyAction;
  error?: string;
};

export type APIMeta = {
  requestKey: string;
  signal?: AbortSignal;
};

export type APIAction<T> = PayloadAction<T, string, APIMeta>;
