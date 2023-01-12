import { of, from } from "rxjs";
import { filter, mergeMap, catchError, map } from "rxjs/operators";

import { commentSet, commentDeleted, commentUpdated } from "app/comments";

import { Epic } from "../types";
import { actions } from "./slice";

export const addCommentEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.addCommentRequest.match),
    mergeMap(({ payload: { taskId, text, requestKey } }) =>
      from(api.addComment({ taskId, text })).pipe(
        mergeMap((commentDTO) =>
          of(commentSet(commentDTO), actions.requestLoaded(requestKey)),
        ),
        catchError((error) => of(actions.requestFailed(error, requestKey))),
      ),
    ),
  );

export const deleteCommentEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(actions.deleteCommentRequest.match),
    mergeMap(({ payload: commentId }) =>
      from(api.deleteComment(commentId)).pipe(
        mergeMap(() => of(actions.deleteCommentRequestLoaded())),
        catchError((error) =>
          of(actions.deleteCommentRequestFailed(String(error))),
        ),
      ),
    ),
  );

export const optimisticDeleteCommentEpic: Epic = (action$) =>
  action$.pipe(
    filter(actions.deleteCommentRequest.match),
    map(({ payload: commentId }) => commentDeleted(commentId)),
  );

export const updateCommentEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.updateCommentRequest.match),
    mergeMap(({ payload: { id, text, requestKey } }) =>
      from(api.editComment({ id, text })).pipe(
        mergeMap((comment) =>
          of(commentUpdated(comment), actions.requestLoaded(requestKey)),
        ),
        catchError((error) => of(actions.requestFailed(error, requestKey))),
      ),
    ),
  );
