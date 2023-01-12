import { sort, filter, propEq } from "ramda";
import { createCachedSelector } from "re-reselect";
import { createSelector } from "reselect";

import { ID } from "models/types";
import { RootState } from "app";

import { selectTasks } from "app/tasks/selectors";
import { extraParam } from "utils/selectors";

export const selectTaskLists = (state: RootState) =>
  state.entities.taskLists.items;

export const selectTaskListById = (state: RootState, taskListId: ID) =>
  selectTaskLists(state)[taskListId] ?? null;

export const selectTaskIds = createCachedSelector(
  [selectTasks, extraParam<ID>()],
  (tasks, taskListId) =>
    Object.keys(filter(propEq("taskListId", taskListId), tasks)),
)((_, taskListId) => taskListId);

export const selectSortedTaskIds = createCachedSelector(
  [selectTaskIds, selectTasks],
  (taskIds, tasks) =>
    sort((id1, id2) => tasks[id1].position - tasks[id2].position, taskIds),
)((_, taskListId) => taskListId);

export const selectTaskListIds = createCachedSelector(
  [selectTaskLists, extraParam<ID>()],
  (taskLists, boardId) =>
    Object.keys(filter(propEq("boardId", boardId), taskLists)),
)((_, boardId) => boardId);

export const selectTaskListsAsArray = createSelector(
  selectTaskLists,
  (taskListsMap) => Object.values(taskListsMap),
);

export const selectSortedTaskListIds = createCachedSelector(
  [selectTaskListsAsArray, extraParam<ID>()],
  (taskLists, boardId) =>
    taskLists
      .filter((list) => list.boardId === boardId)
      .sort((a, b) => a.position - b.position)
      .map((list) => list.id),
)((_, boardId) => boardId);
