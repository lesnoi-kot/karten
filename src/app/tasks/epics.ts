import { of } from "rxjs";
import { map, filter, mergeMap } from "rxjs/operators";
import { AnyAction } from "@reduxjs/toolkit";

import { Epic } from "app/types";
import { ID } from "models/types";
import { POSITION_GAP } from "constants/index";
import { actionPayloadNotEmptyArray } from "utils/epics";
import { actions as commentsActions } from "app/comments";
import { selectCommentsId } from "app/comments/selectors";
import { selectSortedTaskIds } from "app/taskLists/selectors";

import { actions } from "./slice";
import { selectTaskById } from "./selectors";

export const onTaskDeletedEpic: Epic = (action$, store$) =>
  action$.pipe(
    filter(actions.taskDeleted.match),
    map(({ payload: taskId }) => {
      const commentIds = selectCommentsId(store$.value, taskId);
      return commentsActions.commentsDeleted(commentIds);
    }),
    filter(actionPayloadNotEmptyArray),
  );

export const onTasksDeletedEpic: Epic = (action$, store$) =>
  action$.pipe(
    filter(actions.tasksDeleted.match),
    map(({ payload: taskIds }) => {
      const commentIds: ID[] = [];

      taskIds.forEach((taskId) => {
        commentIds.push(...selectCommentsId(store$.value, taskId));
      });
      return commentsActions.commentsDeleted(commentIds);
    }),
    filter(actionPayloadNotEmptyArray),
  );

export const moveTaskEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.taskMoved.match),
    filter(
      ({ payload: { dropTaskId, dropTaskListId } }) =>
        !dropTaskListId && Boolean(dropTaskId),
    ),
    mergeMap(({ payload: { taskId, dropTaskId, isBefore } }) => {
      const dropTask = selectTaskById(store$.value, dropTaskId!)!;
      const taskIds = selectSortedTaskIds(store$.value, dropTask.taskListId);
      const dropTaskIndex = taskIds.indexOf(dropTaskId!);

      if (dropTaskIndex === taskIds.length - 1 && !isBefore) {
        return of(
          actions.taskUpdated({
            id: taskId,
            position: dropTask.position + POSITION_GAP,
            taskListId: dropTask.taskListId,
          }),
        );
      }

      if (dropTaskIndex === 0 && isBefore) {
        return of(
          actions.taskUpdated({
            id: taskId,
            position: dropTask.position - POSITION_GAP,
            taskListId: dropTask.taskListId,
          }),
        );
      }

      const nextOrPrevDropTaskId = taskIds[dropTaskIndex + (isBefore ? -1 : 1)];
      const nextOrPrevDropTask = selectTaskById(
        store$.value,
        nextOrPrevDropTaskId,
      )!;
      const newPosition = Math.floor(
        (dropTask.position + nextOrPrevDropTask.position) / 2,
      );

      // Do we need to fix the gaps?
      if (
        newPosition === dropTask.position ||
        newPosition === nextOrPrevDropTask.position
      ) {
        let position = 0;
        const bulkUpdates: AnyAction[] = taskIds.map((taskId) =>
          actions.taskUpdated({
            id: taskId,
            position: (position += POSITION_GAP),
          }),
        );
        bulkUpdates.push(actions.taskMoved({ taskId, dropTaskId, isBefore }));

        return of(...bulkUpdates);
      }

      return of(
        actions.taskUpdated({
          id: taskId,
          position: newPosition,
          taskListId: dropTask.taskListId,
        }),
      );
    }),
  );

export const moveTaskToListEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.taskMoved.match),
    filter(({ payload: { dropTaskListId } }) => Boolean(dropTaskListId)),
    mergeMap(({ payload: { taskId, dropTaskListId, isBefore } }) => {
      const taskIds = selectSortedTaskIds(store$.value, dropTaskListId!);
      let position = POSITION_GAP;

      if (taskIds.length > 0) {
        const lastTask = selectTaskById(
          store$.value,
          taskIds[isBefore ? 0 : taskIds.length - 1],
        )!;
        position = lastTask.position + POSITION_GAP * (isBefore ? -1 : 1);
      }

      return of(
        actions.taskUpdated({
          id: taskId,
          position,
          taskListId: dropTaskListId,
        }),
      );
    }),
  );
