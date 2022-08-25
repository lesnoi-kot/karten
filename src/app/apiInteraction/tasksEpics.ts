import { of, from } from "rxjs";
import { filter, mergeMap, catchError, map } from "rxjs/operators";
import { AnyAction } from "@reduxjs/toolkit";

import { taskSet, taskDeleted, tasksDeleted, taskUpdated } from "app/tasks";
import { selectTaskById } from "app/tasks/selectors";
import { selectSortedTaskIds } from "app/taskLists/selectors";

import { POSITION_GAP } from "../../constants";
import { Epic } from "../types";
import { actions } from "./slice";

export const addTaskEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.addTaskRequest.match),
    mergeMap(({ payload: { boardId, taskListId, title } }) =>
      from(
        api.addTask({
          boardId,
          taskListId,
          task: { name: title },
        })
      ).pipe(
        mergeMap(({ error, data: task }) =>
          error !== null
            ? of(actions.addTaskRequestFailed({ taskListId, error }))
            : of(taskSet(task!), actions.addTaskRequestLoaded({ taskListId }))
        ),
        catchError((error) =>
          of(actions.addTaskRequestFailed({ taskListId, error }))
        )
      )
    )
  );

export const deleteTaskEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(actions.deleteTaskRequest.match),
    mergeMap(({ payload: { taskId, taskListId } }) =>
      from(api.deleteTask({ taskId })).pipe(
        mergeMap(({ error }) =>
          error !== null
            ? of(actions.deleteTaskRequestFailed(new Error(error)))
            : of(actions.deleteTaskRequestLoaded())
        ),
        catchError((error) => of(actions.deleteTaskRequestFailed(error)))
      )
    )
  );

export const optimisticDeleteTaskEpic: Epic = (action$) =>
  action$.pipe(
    filter(actions.deleteTaskRequest.match),
    map(({ payload: { taskId } }) => taskDeleted(taskId))
  );

export const deleteTasksEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(actions.deleteTasksRequest.match),
    mergeMap(({ payload: { taskIds, taskListId } }) =>
      from(api.deleteTasks({ taskIds, taskListId })).pipe(
        mergeMap(({ error }) =>
          error !== null
            ? of(actions.deleteTaskRequestFailed(error))
            : of(actions.deleteTasksRequestLoaded())
        ),
        catchError((error) =>
          of(actions.deleteTasksRequestFailed(String(error)))
        )
      )
    )
  );

export const optimisticDeleteTasksEpic: Epic = (action$) =>
  action$.pipe(
    filter(actions.deleteTasksRequest.match),
    map(({ payload: { taskIds } }) => tasksDeleted(taskIds))
  );

export const updateTaskEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.updateTaskRequest.match),
    mergeMap(({ payload: { taskId, name, text } }) =>
      from(api.editTask({ taskId, name, text })).pipe(
        mergeMap(({ error, data: task }) =>
          error !== null
            ? of(actions.updateTaskRequestFailed(error))
            : of(taskUpdated(task!), actions.updateTaskRequestLoaded())
        ),
        catchError((error) =>
          of(actions.updateTaskRequestFailed(String(error)))
        )
      )
    )
  );

export const moveTaskEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.moveTaskRequest.match),
    filter(
      ({ payload: { dropTaskId, dropTaskListId } }) =>
        !Boolean(dropTaskListId) && Boolean(dropTaskId)
    ),
    mergeMap(({ payload: { taskId, dropTaskId, atop } }) => {
      const dropTask = selectTaskById(store$.value, dropTaskId!)!;
      const taskIds = selectSortedTaskIds(store$.value, dropTask.taskListId);
      const dropTaskIndex = taskIds.indexOf(dropTaskId!);

      if (dropTaskIndex === taskIds.length - 1 && !atop) {
        return of(
          taskUpdated({
            id: taskId,
            position: dropTask.position + POSITION_GAP,
            taskListId: dropTask.taskListId,
          })
        );
      }

      if (dropTaskIndex === 0 && atop) {
        return of(
          taskUpdated({
            id: taskId,
            position: dropTask.position - POSITION_GAP,
            taskListId: dropTask.taskListId,
          })
        );
      }

      const nextOrPrevDropTaskId = taskIds[dropTaskIndex + (atop ? -1 : 1)];
      const nextOrPrevDropTask = selectTaskById(
        store$.value,
        nextOrPrevDropTaskId
      )!;
      const newPosition = Math.floor(
        (dropTask.position + nextOrPrevDropTask.position) / 2
      );

      // Do we need to fix the gaps?
      if (
        newPosition === dropTask.position ||
        newPosition === nextOrPrevDropTask.position
      ) {
        let position = 0;
        const bulkUpdates: AnyAction[] = taskIds.map((taskId) =>
          taskUpdated({ id: taskId, position: (position += POSITION_GAP) })
        );
        bulkUpdates.push(actions.moveTaskRequest({ taskId, dropTaskId, atop }));

        return of(...bulkUpdates);
      }

      return of(
        taskUpdated({
          id: taskId,
          position: newPosition,
          taskListId: dropTask.taskListId,
        })
      );
    })
  );

export const moveTaskToListEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.moveTaskRequest.match),
    filter(({ payload: { dropTaskListId } }) => Boolean(dropTaskListId)),
    mergeMap(({ payload: { taskId, dropTaskListId, atop } }) => {
      const taskIds = selectSortedTaskIds(store$.value, dropTaskListId!);
      let position = POSITION_GAP;

      if (taskIds.length > 0) {
        const lastTask = selectTaskById(
          store$.value,
          taskIds[atop ? 0 : taskIds.length - 1]
        )!;
        position = lastTask.position + POSITION_GAP * (atop ? -1 : 1);
      }

      return of(
        taskUpdated({
          id: taskId,
          position,
          taskListId: dropTaskListId,
        })
      );
    })
  );
