import { map, filter } from "rxjs/operators";

import { Epic } from "app/types";
import { ID } from "models/types";
import { actions as tasksActions } from "app/tasks";
import { actionPayloadNotEmptyArray } from "utils/epics";

import { actions } from "./slice";
import { selectTaskIds } from "./selectors";

export const onTaskListDeletedEpic: Epic = (action$, store$) =>
  action$.pipe(
    filter(actions.taskListDeleted.match),
    map(({ payload: taskListId }) => {
      const tasks = selectTaskIds(store$.value, taskListId);
      return tasksActions.tasksDeleted(tasks);
    }),
    filter(actionPayloadNotEmptyArray)
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
    filter(actionPayloadNotEmptyArray)
  );
