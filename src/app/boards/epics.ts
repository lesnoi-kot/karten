import { of } from "rxjs";
import { filter, mergeMap } from "rxjs/operators";

import { Epic } from "app/types";
import { actions as taskListsActions } from "app/taskLists";
import { selectTaskListIds } from "app/taskLists/selectors";
import { actions as snackbarsActions } from "app/snackbars";

import { actions } from "./slice";

export const onBoardDeletedEpic: Epic = (action$, store$) =>
  action$.pipe(
    filter(actions.boardDeleted.match),
    mergeMap(({ payload: boardId }) => {
      const taskListIds = selectTaskListIds(store$.value, boardId);

      return of(
        taskListsActions.taskListsDeleted(taskListIds),
        snackbarsActions.showSnackbar({
          message: "The board was deleted",
          type: "info",
        }),
      );
    }),
  );
