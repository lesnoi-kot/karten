import { filter, propEq, values } from "ramda";

import { ID, Comment } from "models/types";
import { RootState } from "store";
import { compareDateStrings } from "utils/selectors";

import { CommentsMap, sliceName } from "./slice";

const selectComments = (state: RootState): CommentsMap =>
  state.entities[sliceName].items;

const selectCommentsByTaskId = (state: RootState, taskId: ID): Comment[] =>
  values(filter(propEq("taskId", taskId), selectComments(state)));

export const selectCommentById = (state: RootState, id: ID): Comment | null =>
  selectComments(state)[id] ?? null;

export const selectCommentsId = (state: RootState, taskId: ID): ID[] =>
  selectCommentsByTaskId(state, taskId).map((comment) => comment.id);

export const selectSortedCommentsId = (state: RootState, taskId: ID): ID[] =>
  selectCommentsByTaskId(state, taskId)
    .sort((a, b) => compareDateStrings(b.dateCreated, a.dateCreated))
    .map((comment) => comment.id);
