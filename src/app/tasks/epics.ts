import { map, filter } from "rxjs/operators";

import { Epic } from "app/types";
import { ID } from "models/types";
import { actions as commentsActions } from "app/comments";
import { selectCommentsId } from "app/comments/selectors";
import { actionPayloadNotEmptyArray } from "utils/epics";

import { actions } from "./slice";

export const onTaskDeletedEpic: Epic = (action$, store$) =>
  action$.pipe(
    filter(actions.taskDeleted.match),
    map(({ payload: taskId }) => {
      const commentIds = selectCommentsId(store$.value, taskId);
      return commentsActions.commentsDeleted(commentIds);
    }),
    filter(actionPayloadNotEmptyArray)
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
    filter(actionPayloadNotEmptyArray)
  );
