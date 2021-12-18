import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { actions as apiActions } from "app/apiInteraction";
import { RootState } from "app/types";
import { ID } from "models/types";
import { FetchState } from "utils/types";
import { buildURL } from "utils/routes";
import { pageUnloaded } from "app/actions";

interface BoardPageState {
  boardId: ID | null;
  selectedTaskId: ID | null;
  boardFetchState: FetchState;
  boardFetchError: Error | null;
  becameDeleted: boolean;
}

const initialState: BoardPageState = {
  boardId: null,
  selectedTaskId: null,
  boardFetchState: FetchState.INITIAL,
  boardFetchError: null,
  becameDeleted: false,
};

export const { actions, reducer, name: sliceName } = createSlice({
  name: "board",
  initialState,
  reducers: {
    taskSelected: (state, { payload: id }: PayloadAction<ID>) => {
      state.selectedTaskId = id;
    },
    taskClosed: (state) => {
      state.selectedTaskId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(apiActions.boardRequest, (state, { payload: boardId }) => {
        state.boardFetchState = FetchState.PENDING;
        state.boardId = boardId;
      })
      .addCase(apiActions.boardRequestLoaded, (state) => {
        state.boardFetchState = FetchState.FULFILLED;
      })
      .addCase(apiActions.boardRequestFailed, (state, { payload: error }) => {
        state.boardFetchState = FetchState.FAILED;
        state.boardFetchError = error;
      })
      .addCase(apiActions.deleteBoardRequestLoaded, (state) => {
        state.becameDeleted = true;
      })
      .addCase(pageUnloaded, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export const { taskSelected, taskClosed } = actions;

export const getState = (state: RootState) => state.pages[sliceName];

export const getBoardFetchState = (state: RootState) =>
  getState(state).boardFetchState;

export const getBoardFetchError = (state: RootState) =>
  getState(state).boardFetchError;

export const useDashboardMethods = (boardId: ID) => {
  const becameDeleted = useSelector((state) => getState(state).becameDeleted);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarIsOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (becameDeleted) {
      navigate(buildURL("pages:projects"));
    }
  }, [navigate, boardId, becameDeleted]);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const onTaskClick = useCallback(
    (taskId: ID) => {
      dispatch(taskSelected(taskId));
      navigate(buildURL("pages:task", { boardId, taskId }), { replace: true });
    },
    [dispatch, navigate, boardId]
  );

  const onTaskModalClose = useCallback(() => {
    dispatch(taskClosed());

    navigate(buildURL("pages:board", { boardId }), { replace: true });
  }, [dispatch, navigate, boardId]);

  return {
    onTaskClick,
    onTaskModalClose,
    sidebarIsOpen,
    openSidebar,
    closeSidebar,
  };
};
