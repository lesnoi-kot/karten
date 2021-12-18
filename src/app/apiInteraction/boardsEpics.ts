import { of, from } from "rxjs";
import { filter, switchMap, mergeMap, catchError } from "rxjs/operators";

import { taskListsSet } from "app/taskLists";
import { tasksSet } from "app/tasks";
import { boardsSet, boardSet, boardDeleted } from "app/boards";
import { selectTaskListIds } from "app/boards/selectors";
import { commentsSet } from "app/comments";
import { normalizeBoard, normalizeBoards } from "app/boards/utils";

import { Epic } from "../types";
import { actions } from "./slice";

export const boardsRequestEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.boardsRequest.match),
    switchMap(() =>
      from(api.getBoards()).pipe(
        mergeMap(({ data: boardsDTO, error }) => {
          if (error) {
            return of(actions.boardsRequestFailed(new Error(error)));
          }

          const { boards } = normalizeBoards(boardsDTO);

          return of(boardsSet(boards), actions.boardsRequestLoaded());
        }),
        catchError((error) => of(actions.boardsRequestFailed(error)))
      )
    )
  );

export const boardRequestEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.boardRequest.match),
    switchMap(({ payload: boardId }) =>
      from(api.getBoard({ id: boardId })).pipe(
        mergeMap(({ data: boardDTO, error }) => {
          if (error) {
            return of(actions.boardRequestFailed(new Error(error)));
          }

          const { boards, taskLists, tasks, comments } = normalizeBoard(
            boardDTO
          );

          return of(
            tasksSet(tasks),
            taskListsSet(taskLists),
            boardsSet(boards),
            commentsSet(comments),
            actions.boardRequestLoaded()
          );
        }),
        catchError((error) => of(actions.boardRequestFailed(error)))
      )
    )
  );

export const addBoardEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.addBoardRequest.match),
    switchMap(({ payload: { name } }) =>
      from(api.addBoard({ name })).pipe(
        mergeMap(({ data: board, error }) => {
          if (error) {
            return of(actions.addBoardRequestFailed(error));
          }

          return of(boardSet(board!), actions.addBoardRequestLoaded());
        }),
        catchError((error) => of(actions.addBoardRequestFailed(String(error))))
      )
    )
  );

export const updateBoardEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.updateBoardRequest.match),
    switchMap(({ payload: { boardId, name } }) =>
      from(api.editBoard({ id: boardId, name })).pipe(
        mergeMap(({ data: boardDTO, error }) => {
          if (error) {
            return of(actions.updateBoardRequestFailed(error));
          }

          const { boards, taskLists, tasks, comments } = normalizeBoard(
            boardDTO
          );

          return of(
            tasksSet(tasks),
            taskListsSet(taskLists),
            boardsSet(boards),
            commentsSet(comments),
            actions.updateBoardRequestLoaded()
          );
        }),
        catchError((error) =>
          of(actions.updateBoardRequestFailed(String(error)))
        )
      )
    )
  );

export const deleteBoardEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.deleteBoardRequest.match),
    switchMap(({ payload: boardId }) =>
      from(api.deleteBoard({ boardId })).pipe(
        mergeMap(({ error }) => {
          if (error) {
            return of(actions.deleteBoardRequestFailed(error));
          }

          return of(boardDeleted(boardId), actions.deleteBoardRequestLoaded());
        }),
        catchError((error) =>
          of(actions.deleteBoardRequestFailed(String(error)))
        )
      )
    )
  );

export const clearBoardEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.clearBoardRequest.match),
    mergeMap(({ payload: boardId }) => {
      const taskListIds = selectTaskListIds(store$.value, boardId);
      return taskListIds.map((taskListId) =>
        actions.deleteTaskListRequest({ taskListId, boardId })
      );
    })
  );
