import { map, filter } from "rxjs/operators";

import { Epic } from "app/types";
import { actions as taskListsActions } from "app/taskLists";
import { selectTaskListIds } from "app/taskLists/selectors";
import { actionPayloadNotEmptyArray } from "utils/epics";

import { actions } from "./slice";

export const onBoardDeletedEpic: Epic = (action$, store$) =>
  action$.pipe(
    filter(actions.boardDeleted.match),
    map(({ payload: boardId }) => {
      const taskListIds = selectTaskListIds(store$.value, boardId);
      return taskListsActions.taskListsDeleted(taskListIds);
    }),
    filter(actionPayloadNotEmptyArray),
  );
