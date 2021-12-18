import { isNil } from "ramda";
import { of, from } from "rxjs";
import { filter, mergeMap, catchError, map } from "rxjs/operators";

import { commentSet, commentDeleted, commentUpdated } from "app/comments";

import { Epic } from "../types";
import { actions } from "./slice";

export const addCommentEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.addCommentRequest.match),
    mergeMap(({ payload: { taskId, text } }) =>
      from(api.addComment({ taskId, text })).pipe(
        mergeMap(({ error, data: comment }) =>
          isNil(error)
            ? of(commentSet(comment!), actions.addCommentRequestLoaded())
            : of(actions.addCommentRequestFailed(error))
        ),
        catchError((error) =>
          of(actions.addCommentRequestFailed(String(error)))
        )
      )
    )
  );

export const deleteCommentEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(actions.deleteCommentRequest.match),
    mergeMap(({ payload: { commentId } }) =>
      from(api.deleteComment({ id: commentId })).pipe(
        mergeMap(({ error }) =>
          isNil(error)
            ? of(actions.deleteCommentRequestLoaded())
            : of(actions.deleteCommentRequestFailed(error))
        ),
        catchError((error) =>
          of(actions.deleteCommentRequestFailed(String(error)))
        )
      )
    )
  );

export const optimisticDeleteCommentEpic: Epic = (action$) =>
  action$.pipe(
    filter(actions.deleteCommentRequest.match),
    map(({ payload: { commentId } }) => commentDeleted(commentId))
  );

export const updateCommentEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.updateCommentRequest.match),
    mergeMap(({ payload: { commentId, text } }) =>
      from(api.editComment({ commentId, text })).pipe(
        mergeMap(({ error, data: comment }) =>
          isNil(error)
            ? of(commentUpdated(comment!), actions.updateCommentRequestLoaded())
            : of(actions.updateCommentRequestFailed(error))
        ),
        catchError((error) =>
          of(actions.updateCommentRequestFailed(String(error)))
        )
      )
    )
  );
