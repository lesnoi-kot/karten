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
    switchMap(({ payload: boardId }) =>
      from(api.getBoard(boardId)).pipe(
        mergeMap((board) => {
          const { boards, taskLists, tasks, comments } = normalizeBoard(board);

          return of(
            tasksSet(tasks),
            taskListsSet(taskLists),
            boardsSet(boards),
            commentsSet(comments),
            actions.boardRequestLoaded(),
          );
        }),
        catchError((error) => of(actions.boardRequestFailed(error))),
      ),
    ),
  );

export const addBoardEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.addBoardRequest.match),
    switchMap(({ payload }) =>
      from(api.addBoard(payload)).pipe(
        mergeMap((board) => {
          return of(boardSet(board), actions.addBoardRequestLoaded());
        }),
        catchError((error) => of(actions.addBoardRequestFailed(String(error)))),
      ),
    ),
  );

export const updateBoardEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.updateBoardRequest.match),
    switchMap(({ payload: { id, name } }) =>
      from(api.editBoard({ id, name })).pipe(
        mergeMap((board) => {
          const { boards, taskLists, tasks, comments } = normalizeBoard(board);

          return of(
            tasksSet(tasks),
            taskListsSet(taskLists),
            boardsSet(boards),
            commentsSet(comments),
            actions.updateBoardRequestLoaded(),
          );
        }),
        catchError((error) =>
          of(actions.updateBoardRequestFailed(String(error))),
        ),
      ),
    ),
  );

export const deleteBoardEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.deleteBoardRequest.match),
    switchMap(({ payload: boardId }) =>
      from(api.deleteBoard(boardId)).pipe(
        mergeMap(() =>
          of(boardDeleted(boardId), actions.deleteBoardRequestLoaded()),
        ),
        catchError((error) =>
          of(actions.deleteBoardRequestFailed(String(error))),
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
