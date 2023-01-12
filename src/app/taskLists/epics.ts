import { of } from "rxjs";
import { map, filter, mergeMap } from "rxjs/operators";
import { AnyAction } from "@reduxjs/toolkit";

import { Epic } from "app/types";
import { ID } from "models/types";
import { actions as tasksActions } from "app/tasks";
import { actionPayloadNotEmptyArray } from "utils/epics";

import { POSITION_GAP } from "../../constants";
import { actions } from "./slice";
import {
  selectTaskIds,
  selectTaskListById,
  selectSortedTaskListIds,
} from "./selectors";

export const onTaskListDeletedEpic: Epic = (action$, store$) =>
  action$.pipe(
    filter(actions.taskListDeleted.match),
    map(({ payload: taskListId }) => {
      const tasks = selectTaskIds(store$.value, taskListId);
      return tasksActions.tasksDeleted(tasks);
    }),
    filter(actionPayloadNotEmptyArray),
  );

export const onTaskListsDeletedEpic: Epic = (action$, store$) =>
  action$.pipe(
    filter(actions.taskListsDeleted.match),
    map(({ payload: taskListIds }) => {
      const tasks: ID[] = [];

      taskListIds.forEach((taskListId) => {
        tasks.push(...selectTaskIds(store$.value, taskListId));
      });

      return tasksActions.tasksDeleted(tasks);
    }),
    filter(actionPayloadNotEmptyArray),
  );

export const taskListMovedEpic: Epic = (action$, store$) =>
  action$.pipe(
    filter(actions.taskListMoved.match),
    mergeMap(({ payload: { taskListId, dropTaskListId, before } }) => {
      const dropTaskList = selectTaskListById(store$.value, dropTaskListId)!;
      const listIds = selectSortedTaskListIds(
        store$.value,
        dropTaskList.boardId,
      );
      const dropTaskListIndex = listIds.indexOf(dropTaskListId);
      const dragTaskListIndex = listIds.indexOf(taskListId);
      // const before = dragTaskListIndex < dropTaskListIndex;

      if (dropTaskListIndex === 0) {
        return of(
          actions.taskListUpdated({
            id: taskListId,
            position: dropTaskList.position - 1000,
          }),
        );
      }

      if (dropTaskListIndex === listIds.length - 1) {
        return of(
          actions.taskListUpdated({
            id: taskListId,
            position: dropTaskList.position + 1000,
          }),
        );
      }

      const nextOrPrevDropTaskListId =
        listIds[dropTaskListIndex + (before ? -1 : 1)];
      const nextOrPrevDropTask = selectTaskListById(
        store$.value,
        nextOrPrevDropTaskListId,
      )!;
      const newPosition = Math.floor(
        (dropTaskList.position + nextOrPrevDropTask.position) / 2,
      );

      // Do we need to fix the gaps?
      if (
        newPosition === dropTaskList.position ||
        newPosition === nextOrPrevDropTask.position
      ) {
        let position = 0;
        const bulkUpdates: AnyAction[] = listIds.map((id) =>
          actions.taskListUpdated({ id, position: (position += POSITION_GAP) }),
        );
        bulkUpdates.push(
          actions.taskListMoved({ taskListId, dropTaskListId, before }),
        );

        return of(...bulkUpdates);
      }

      return of(
        actions.taskListUpdated({
          id: taskListId,
          position: newPosition,
        }),
      );
    }),
  );
