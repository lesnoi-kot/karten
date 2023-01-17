import { useCallback, useRef, useMemo, useEffect } from "react";
import { ActionCreator, nanoid } from "@reduxjs/toolkit";

import { FetchState } from "utils/types";
import { useAppDispatch, useAppSelector } from "app/hooks";

import { selectRequestInfo } from "./selectors";
import { APIAction, RequestInfo } from "./types";

type UseRequestInfoReturnType = Partial<RequestInfo> & {
  isLoading: boolean;
  isFailed: boolean;
  isLoaded: boolean;
  isRetrying: boolean;
};

export const useRequestInfo = (
  requestKey: string,
): UseRequestInfoReturnType => {
  const requestInfo = useAppSelector((state) =>
    selectRequestInfo(state, requestKey),
  );

  if (!requestInfo) {
    return {
      state: FetchState.INITIAL,
      isLoading: false,
      isFailed: false,
      isLoaded: false,
      isRetrying: false,
    };
  }

  return {
    ...requestInfo,
    isLoading: requestInfo.state === FetchState.PENDING,
    isFailed: requestInfo.state === FetchState.FAILED,
    isLoaded: requestInfo.state === FetchState.FULFILLED,
    isRetrying:
      Boolean(requestInfo.error) && requestInfo.state === FetchState.PENDING,
  };
};

const noPayload = Symbol("no payload");
type Callback = () => void;

type UseRequestReturnType<P> = UseRequestInfoReturnType & {
  reload(): void;
  load(payload: P): void;
  onSuccess(callback: Callback): void;
};

export function useRequest<P>(
  actionCreator: ActionCreator<APIAction<P>>,
): UseRequestReturnType<P> {
  const dispatch = useAppDispatch();
  const prevPayload = useRef<P | Symbol>(noPayload);
  const successHandler = useRef<Callback>(() => {});
  const requestKey = useMemo(() => nanoid(), []);

  const load = useCallback(
    (payload: P) => {
      prevPayload.current = payload;
      dispatch(actionCreator(payload, requestKey));
    },
    [dispatch, actionCreator, requestKey],
  );

  const reload = useCallback(() => {
    if (prevPayload.current !== noPayload) {
      dispatch(actionCreator(prevPayload.current, requestKey));
    }
  }, [dispatch, prevPayload, actionCreator, requestKey]);

  const onSuccess = useCallback((callback: Callback) => {
    successHandler.current = callback;
  }, []);

  const requestInfo = useRequestInfo(requestKey);

  useEffect(() => {
    if (requestInfo.isLoaded) {
      successHandler.current();
    }
  }, [dispatch, requestInfo.isLoaded]);

  return {
    ...requestInfo,
    load,
    reload,
    onSuccess,
  };
}
