import { of, from } from "rxjs";
import { filter, switchMap, mergeMap, catchError } from "rxjs/operators";

import { taskListsSet } from "app/taskLists";
import { tasksSet } from "app/tasks";
import { boardsSet, boardSet, boardDeleted } from "app/boards";
import { selectTaskListIds } from "app/taskLists/selectors";
import { commentsSet } from "app/comments";
import { normalizeBoard } from "app/boards/utils";

import { Epic } from "../types";
import { actions } from "./slice";

export const boardRequestEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.boardRequest.match),
    switchMap(({ payload: boardId, meta: { requestKey } }) =>
      from(api.getBoard(boardId)).pipe(
        mergeMap((board) => {
          const { boards, taskLists, tasks, comments } = normalizeBoard(board);

          return of(
            tasksSet(tasks),
            taskListsSet(taskLists),
            boardsSet(boards),
            commentsSet(comments),
            actions.requestLoaded(requestKey),
          );
        }),
        catchError((error) => of(actions.requestFailed(error, requestKey))),
      ),
    ),
  );

export const addBoardEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.addBoardRequest.match),
    switchMap(({ payload, meta: { requestKey } }) =>
      from(api.addBoard(payload)).pipe(
        mergeMap((board) => {
          return of(boardSet(board), actions.requestLoaded(requestKey));
        }),
        catchError((error) =>
          of(actions.requestFailed(String(error), requestKey)),
        ),
      ),
    ),
  );

export const updateBoardEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.updateBoardRequest.match),
    switchMap(({ payload, meta }) =>
      from(api.editBoard(payload)).pipe(
        mergeMap((board) => {
          return of(boardSet(board), actions.requestLoaded(meta.requestKey));
        }),
        catchError((error) =>
          of(actions.requestFailed(String(error), meta.requestKey)),
        ),
      ),
    ),
  );

export const deleteBoardEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.deleteBoardRequest.match),
    switchMap(({ payload: boardId, meta: { requestKey } }) =>
      from(api.deleteBoard(boardId)).pipe(
        mergeMap(() =>
          of(boardDeleted(boardId), actions.requestLoaded(requestKey)),
        ),
        catchError((error) =>
          of(actions.requestFailed(String(error), requestKey)),
        ),
      ),
    ),
  );

export const clearBoardEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.clearBoardRequest.match),
    mergeMap(({ payload: boardId }) => {
      const taskListIds = selectTaskListIds(store$.value, boardId);
      return taskListIds.map((taskListId) =>
        actions.deleteTaskListRequest(taskListId),
      );
    }),
  );
