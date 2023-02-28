import { useCallback, useRef, useMemo, useEffect } from "react";
import { ActionCreator, AnyAction, nanoid } from "@reduxjs/toolkit";

import { FetchState } from "utils/types";
import { useAppDispatch, useAppSelector } from "app/hooks";

import { selectRequestInfo } from "./selectors";
import { APIAction, RequestInfo } from "./types";
import { isAPIAction, actions } from "./slice";

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

export const useRequestInfoOfAction = (action: AnyAction | null) => {
  return useRequestInfo(
    action && isAPIAction(action) ? action.meta.requestKey : "",
  );
};

const noPayload = Symbol("no payload");
type Callback = () => void;

type UseRequestReturnType<P> = UseRequestInfoReturnType & {
  reload(): void;
  cancel(): void;
  load(payload: P): void;
  getAction(payload: P): APIAction<P>;
  onSuccess(callback: Callback): void;
};

export function useRequest<P>(
  actionCreator: ActionCreator<APIAction<P>>,
  options?: {
    onSuccess?: () => void;
    requestKey?: string;
  },
): UseRequestReturnType<P> {
  const dispatch = useAppDispatch();
  const prevPayload = useRef<P | Symbol>(noPayload);
  const successHandler = useRef<Callback>(() => {});
  const requestKey = useMemo(() => nanoid(), [actionCreator]);

  useEffect(() => {
    return () => {
      dispatch(actions.requestCleanup(requestKey));
    };
  }, [dispatch, requestKey]);

  const getAction = useCallback(
    (payload: P) => {
      prevPayload.current = payload;
      return actionCreator(payload, requestKey);
    },
    [actionCreator, requestKey],
  );

  const load = useCallback(
    (payload: P) => {
      dispatch(getAction(payload));
    },
    [dispatch, getAction],
  );

  const reload = useCallback(() => {
    if (prevPayload.current !== noPayload) {
      dispatch(getAction(prevPayload.current as P));
    }
  }, [dispatch, getAction, prevPayload]);

  const onSuccess = useCallback((callback: Callback) => {
    successHandler.current = callback;
  }, []);

  const cancel = useCallback(() => {
    // TODO
  }, []);

  const requestInfo = useRequestInfo(requestKey);

  useEffect(() => {
    if (requestInfo.isLoaded) {
      successHandler.current();

      if (options?.onSuccess) {
        options.onSuccess();
      }
    }
  }, [requestInfo.isLoaded, options?.onSuccess]);

  return {
    ...requestInfo,
    load,
    reload,
    cancel,
    onSuccess,
    getAction,
  };
}
