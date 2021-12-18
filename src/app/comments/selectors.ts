import { filter, propEq } from "ramda";
import { createCachedSelector } from "re-reselect";

import { ID, Comment } from "models/types";
import { RootState } from "app";
import { extraParam } from "utils/selectors";

import { CommentsMap, sliceName } from "./slice";

export const selectComments = (state: RootState): CommentsMap =>
  state.entities[sliceName].items;

export const selectCommentById = (state: RootState, id: ID): Comment | null =>
  selectComments(state)[id] ?? null;

export const selectCommentsId = createCachedSelector(
  [selectComments, extraParam<ID>()],
  (comments, taskId) =>
    Object.keys(filter(propEq("taskId", taskId), comments as any))
)((_, taskId) => taskId);
