import { useSelector } from "react-redux";

import { FetchState } from "utils/types";
import { RootState } from "app";

import { selectRequestInfo } from "./selectors";
import { RequestInfo } from "./types";

type UseRequestInfoReturnType = Partial<RequestInfo> & {
  isLoading: boolean;
  isError: boolean;
  isLoaded: boolean;
};

export const useRequestInfo = (
  requestKey: string,
): UseRequestInfoReturnType => {
  const requestInfo = useSelector((state: RootState) =>
    selectRequestInfo(state, requestKey),
  );

  if (!requestInfo) {
    return {
      state: FetchState.INITIAL,
      isLoading: false,
      isError: false,
      isLoaded: false,
    };
  }

  return {
    isLoading: requestInfo.state === FetchState.PENDING,
    isError: requestInfo.state === FetchState.FAILED,
    isLoaded: requestInfo.state === FetchState.FULFILLED,
    ...requestInfo,
  };
};
