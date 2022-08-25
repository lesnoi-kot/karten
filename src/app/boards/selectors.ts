import { filter, propEq } from "ramda";
import { createSelector } from "reselect";
import { createCachedSelector } from "re-reselect";

import { ID } from "models/types";
import { RootState } from "app";
import { selectTaskLists } from "app/taskLists/selectors";
import { extraParam } from "utils/selectors";

import { BoardsMap, sliceName } from "./slice";

export const selectBoards = (state: RootState): BoardsMap =>
  state.entities[sliceName].items;

export const selectBoardsIds = createSelector(selectBoards, Object.keys);

export const selectBoard = (state: RootState, id: ID) =>
  selectBoards(state)[id] ?? null;

export const selectBoardName = (state: RootState, id: ID): string =>
  selectBoards(state)[id]?.name ?? "";

export const selectTaskListsAsArray = createSelector(
  selectTaskLists,
  (taskListsMap) => Object.values(taskListsMap)
);

export const selectTaskListIds = createCachedSelector(
  [selectTaskLists, extraParam<ID>()],
  (taskLists, boardId) =>
    Object.keys(filter(propEq("boardId", boardId), taskLists))
)((_, boardId) => boardId);

export const selectSortedTaskListIds = createCachedSelector(
  [selectTaskListsAsArray, extraParam<ID>()],
  (taskLists, boardId) =>
    taskLists
      .filter((list) => list.boardId === boardId)
      .sort((a, b) => a.position - b.position)
      .map((list) => list.id)
)((_, boardId) => boardId);
