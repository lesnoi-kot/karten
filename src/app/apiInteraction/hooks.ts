import React from "react";
import { useSelector } from "react-redux";

import { FetchState } from "utils/types";
import { RootState } from "app";

import { selectRequestInfo } from "./selectors";
import { RequestInfo } from "./types";

type UseRequestInfoReturnType = Partial<RequestInfo> & {
  isLoading: boolean;
};

export const useRequestInfo = (
  requestKey: string
): UseRequestInfoReturnType => {
  const requestInfo = useSelector((state: RootState) =>
    selectRequestInfo(state, requestKey)
  );

  if (!requestInfo) {
    return {
      isLoading: false,
      error: null,
    };
  }

  return {
    isLoading: requestInfo.state === FetchState.PENDING,
    ...requestInfo,
  };
};
