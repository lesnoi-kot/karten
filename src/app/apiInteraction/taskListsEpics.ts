import { of, from } from "rxjs";
import { mergeAll, filter, mergeMap, catchError, map } from "rxjs/operators";

import { taskListDeleted, taskListSet, taskListUpdated } from "app/taskLists";
import { tasksDeleted } from "app/tasks";
import { showSnackbar } from "app/snackbars";
import { selectTaskIds, selectTaskListById } from "app/taskLists/selectors";

import { Epic } from "../types";
import { actions } from "./slice";

export const taskListRequestEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.taskListRequest.match),
    mergeMap(({ payload: taskListId, meta: { requestKey } }) =>
      from(api.getTaskList(taskListId)).pipe(
        mergeMap((taskList) =>
          of(taskListSet(taskList), actions.requestLoaded(requestKey)),
        ),
        catchError((error) => of(actions.requestFailed(error, requestKey))),
      ),
    ),
  );

export const taskListAddEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.addTaskListRequest.match),
    mergeMap(({ payload: { boardId, name }, meta: { requestKey } }) =>
      from(api.addTaskList({ boardId, name, position: Date.now() })).pipe(
        mergeMap((taskList) =>
          of(taskListSet(taskList), actions.requestLoaded(requestKey)),
        ),
        catchError((error) =>
          of(
            actions.requestFailed(String(error), requestKey),
            showSnackbar({ message: String(error), type: "error" }),
          ),
        ),
      ),
    ),
  );

export const taskListDeleteEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.deleteTaskListRequest.match),
    mergeMap(({ payload: taskListId, meta: { requestKey } }) =>
      from(api.deleteTaskList(taskListId)).pipe(
        mergeMap(() => {
          return of(
            taskListDeleted(taskListId),
            actions.requestLoaded(requestKey),
          );
        }),
        catchError((error) =>
          of(actions.requestFailed(String(error), requestKey)),
        ),
      ),
    ),
  );

export const taskListUpdateEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.updateTaskListRequest.match),
    mergeMap(({ payload, meta: { requestKey } }) =>
      from(api.editTaskList(payload)).pipe(
        mergeMap((taskList) =>
          of(taskListUpdated(taskList), actions.requestLoaded(requestKey)),
        ),
        catchError((error) =>
          of(actions.requestFailed(String(error), requestKey)),
        ),
      ),
    ),
  );

export const taskListClearEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.clearTaskListRequest.match),
    mergeMap(({ payload: taskListId, meta: { requestKey } }) => {
      const taskIds = selectTaskIds(store$.value, taskListId);

      return of(
        of(tasksDeleted(taskIds)),
        from(api.deleteTasks(taskIds)).pipe(
          map(() => actions.requestLoaded(requestKey)),
          catchError((error) =>
            of(actions.requestFailed(String(error), requestKey)),
          ),
        ),
      );
    }),
    mergeAll(),
  );

export const syncTaskListEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.syncTaskListRequest.match),
    map(({ payload: taskListId }) => {
      const taskList = selectTaskListById(store$.value, taskListId)!;

      const payload = {
        id: taskListId,
        name: taskList.name,
        position: taskList.position,
      };

      return actions.updateTaskListRequest(payload);
    }),
  );
