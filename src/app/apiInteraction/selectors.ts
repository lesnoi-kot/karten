import { createSelector } from "reselect";

import { ID } from "models/types";
import { RootState } from "app";
import { FetchState } from "utils/types";

import { TaskListMetaInfo } from "./slice";
import { RequestInfo } from "./types";

export const selectTaskListMeta =
  (taskListId: ID) =>
  (state: RootState): TaskListMetaInfo | null =>
    state.apiInteraction.taskLists[taskListId] ?? null;

export const selectIsTaskAdding =
  (taskListId: ID) =>
  (state: RootState): boolean =>
    selectTaskListMeta(taskListId)(state)?.taskAddState === FetchState.PENDING;

export const selectIsBoardAdding = (state: RootState): boolean =>
  state.apiInteraction.boardAddRequestState === FetchState.PENDING;

export const selectBoardAddRequestState = (state: RootState): FetchState =>
  state.apiInteraction.boardAddRequestState;

export const selectTaskListAddRequestState = (state: RootState): FetchState =>
  state.apiInteraction.taskListAddRequestState;

export const selectRequestInfo = (
  state: RootState,
  requestKey: string
): RequestInfo | null => state.apiInteraction.requestsInfo[requestKey] ?? null;
