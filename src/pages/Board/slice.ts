import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, generatePath } from "react-router-dom";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { actions as apiActions } from "app/apiInteraction";
import { actions as boardsActions } from "app/boards";
import { RootState } from "app/types";
import { ID } from "models/types";
import { pageUnloaded } from "app/actions";

interface BoardPageState {
  boardId: ID | null;
  selectedTaskId: ID | null;
  shouldRedirectToProject: boolean;
}

const initialState: BoardPageState = {
  boardId: null,
  selectedTaskId: null,
  shouldRedirectToProject: false,
};

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
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
        state.boardId = boardId;
      })
      .addCase(boardsActions.boardDeleted, (state, { payload: deletedId }) => {
        if (deletedId === state.boardId) {
          state.shouldRedirectToProject = true;
        }
      })
      .addCase(pageUnloaded, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export const { taskSelected, taskClosed } = actions;

const selectPageState = (state: RootState) => state.pages[sliceName];

export const selectShouldRedirectToProject = (state: RootState) =>
  selectPageState(state).shouldRedirectToProject;

export const useDashboardMethods = (boardId: ID) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onTaskClick = useCallback(
    (taskId: ID) => {
      dispatch(taskSelected(taskId));
      navigate({ search: `?taskId=${taskId}` }, { replace: false });
    },
    [dispatch, navigate, boardId],
  );

  const onTaskModalClose = useCallback(() => {
    dispatch(taskClosed());

    navigate(generatePath("/boards/:id", { id: boardId }), { replace: true });
  }, [dispatch, navigate, boardId]);

  return {
    onTaskClick,
    onTaskModalClose,
  };
};
