import { of, from } from "rxjs";
import { mergeAll, filter, mergeMap, catchError, map } from "rxjs/operators";

import { taskListDeleted, taskListSet, taskListUpdated } from "app/taskLists";
import { tasksDeleted } from "app/tasks";
import { selectTaskIds, selectTaskListById } from "app/taskLists/selectors";

import { Epic } from "../types";
import { actions } from "./slice";
import { UpdateTaskListPayload } from "./types";

export const taskListRequestEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.taskListRequest.match),
    mergeMap(({ payload: taskListId }) =>
      from(api.getTaskList(taskListId)).pipe(
        mergeMap((taskList) =>
          of(taskListSet(taskList), actions.taskListRequestLoaded()),
        ),
        catchError((error) => of(actions.taskListRequestFailed(error))),
      ),
    ),
  );

export const taskListAddEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.addTaskListRequest.match),
    mergeMap(({ payload: { boardId, name } }) =>
      from(api.addTaskList({ boardId, name })).pipe(
        mergeMap(({ data: taskList, error }: any) => {
          if (error) {
            return of(actions.addTaskListRequestFailed(String(error)));
          }

          return of(taskListSet(taskList), actions.addTaskListRequestLoaded());
        }),
        catchError((error) =>
          of(actions.addTaskListRequestFailed(String(error))),
        ),
      ),
    ),
  );

export const taskListDeleteEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.deleteTaskListRequest.match),
    mergeMap(({ payload: taskListId }) =>
      from(api.deleteTaskList(taskListId)).pipe(
        mergeMap(() => {
          return of(
            taskListDeleted(taskListId),
            actions.deleteTaskListRequestLoaded(),
          );
        }),
        catchError((error) =>
          of(actions.deleteTaskListRequestFailed(String(error))),
        ),
      ),
    ),
  );

export const taskListUpdateEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.updateTaskListRequest.match),
    mergeMap(({ payload }) =>
      from(api.editTaskList(payload)).pipe(
        mergeMap((taskList) =>
          of(taskListUpdated(taskList), actions.updateTaskListRequestLoaded()),
        ),
        catchError((error) =>
          of(actions.updateTaskListRequestFailed(String(error))),
        ),
      ),
    ),
  );

export const taskListClearEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.clearTaskListRequest.match),
    mergeMap(({ payload: taskListId }) => {
      const taskIds = selectTaskIds(store$.value, taskListId);

      return of(
        of(tasksDeleted(taskIds)),
        from(api.deleteTasks(taskIds)).pipe(
          map(() => actions.deleteTasksRequestLoaded()),
          catchError((error) =>
            of(actions.deleteTasksRequestFailed(String(error))),
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

      const payload: UpdateTaskListPayload = {
        id: taskListId,
        name: taskList.name,
        position: taskList.position,
      };

      return actions.updateTaskListRequest(payload);
    }),
  );
