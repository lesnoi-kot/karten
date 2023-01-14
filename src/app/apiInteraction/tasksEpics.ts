import { of, from } from "rxjs";
import { filter, mergeMap, catchError, map } from "rxjs/operators";

import { taskSet, taskDeleted, tasksDeleted, taskUpdated } from "app/tasks";
import { selectTaskById } from "app/tasks/selectors";
import { showSnackbar } from "components/Snackbars/slice";

import { Epic } from "../types";
import { actions } from "./slice";

export const addTaskEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.addTaskRequest.match),
    mergeMap(({ payload, meta: { requestKey } }) =>
      from(api.addTask(payload)).pipe(
        mergeMap((task) =>
          of(taskSet(task), actions.requestLoaded(requestKey)),
        ),
        catchError((error) =>
          of(
            actions.requestFailed(error, requestKey),
            showSnackbar({ message: String(error), type: "error" }),
          ),
        ),
      ),
    ),
  );

export const deleteTaskEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(actions.deleteTaskRequest.match),
    mergeMap(({ payload: taskId, meta: { requestKey } }) =>
      from(api.deleteTask(taskId)).pipe(
        mergeMap(() => of(actions.requestLoaded(requestKey))),
        catchError((error) => of(actions.requestFailed(error, requestKey))),
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
    mergeMap(({ payload: taskIds, meta: { requestKey } }) =>
      from(api.deleteTasks(taskIds)).pipe(
        mergeMap(() => of(actions.requestLoaded(requestKey))),
        catchError((error) =>
          of(actions.requestFailed(String(error), requestKey)),
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
    mergeMap(({ payload, meta: { requestKey } }) =>
      from(api.editTask(payload)).pipe(
        mergeMap((task) =>
          of(taskUpdated(task), actions.requestLoaded(requestKey)),
        ),
        catchError((error) =>
          of(actions.requestFailed(String(error), requestKey)),
        ),
      ),
    ),
  );

export const syncTaskEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.syncTaskRequest.match),
    map(({ payload: taskId }) => {
      const task = selectTaskById(store$.value, taskId)!;

      const payload = {
        id: taskId,
        taskListId: task.taskListId,
        name: task.name,
        text: task.text,
        position: task.position,
        dueDate: task.dueDate,
      };

      return actions.updateTaskRequest(payload);
    }),
  );
