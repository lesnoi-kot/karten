import { of, from } from "rxjs";
import { filter, mergeMap, catchError, map } from "rxjs/operators";

import { taskSet, taskDeleted, tasksDeleted, taskUpdated } from "app/tasks";
import { selectTaskById } from "app/tasks/selectors";

import { Epic } from "../types";
import { actions } from "./slice";
import { UpdateTaskPayload } from "./types";

export const addTaskEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.addTaskRequest.match),
    mergeMap(({ payload }) =>
      from(api.addTask(payload)).pipe(
        mergeMap((task) =>
          of(
            taskSet(task),
            actions.addTaskRequestLoaded({ taskListId: payload.taskListId }),
          ),
        ),
        catchError((error) =>
          of(
            actions.addTaskRequestFailed({
              taskListId: payload.taskListId,
              error,
            }),
          ),
        ),
      ),
    ),
  );

export const deleteTaskEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(actions.deleteTaskRequest.match),
    mergeMap(({ payload: taskId }) =>
      from(api.deleteTask(taskId)).pipe(
        mergeMap(() => of(actions.deleteTaskRequestLoaded())),
        catchError((error) => of(actions.deleteTaskRequestFailed(error))),
      ),
    ),
  );

export const optimisticDeleteTaskEpic: Epic = (action$) =>
  action$.pipe(
    filter(actions.deleteTaskRequest.match),
    map(({ payload: taskId }) => taskDeleted(taskId)),
  );

export const deleteTasksEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(actions.deleteTasksRequest.match),
    mergeMap(({ payload: taskIds }) =>
      from(api.deleteTasks(taskIds)).pipe(
        mergeMap(() => of(actions.deleteTasksRequestLoaded())),
        catchError((error) =>
          of(actions.deleteTasksRequestFailed(String(error))),
        ),
      ),
    ),
  );

export const optimisticDeleteTasksEpic: Epic = (action$) =>
  action$.pipe(
    filter(actions.deleteTasksRequest.match),
    map(({ payload: taskIds }) => tasksDeleted(taskIds)),
  );

export const updateTaskEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.updateTaskRequest.match),
    mergeMap(({ payload }) =>
      from(api.editTask(payload)).pipe(
        mergeMap((task) =>
          of(taskUpdated(task), actions.updateTaskRequestLoaded()),
        ),
        catchError((error) =>
          of(actions.updateTaskRequestFailed(String(error))),
        ),
      ),
    ),
  );

export const syncTaskEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.syncTaskRequest.match),
    map(({ payload: taskId }) => {
      const task = selectTaskById(store$.value, taskId)!;

      const payload: UpdateTaskPayload = {
        id: taskId,
        name: task.name,
        text: task.text,
        position: task.position,
      };

      return actions.updateTaskRequest(payload);
    }),
  );
