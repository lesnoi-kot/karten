import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ID, Comment } from "models/types";

export type CommentsMap = Record<ID, Comment>;

export type TasksSlice = {
  items: CommentsMap;
};

const initialState: TasksSlice = {
  items: {},
};

export const { actions, reducer, name: sliceName } = createSlice({
  name: "comments",
  initialState,
  reducers: {
    commentsSet: (state, { payload }: PayloadAction<CommentsMap>) => {
      state.items = payload;
    },
    commentSet: (state, { payload: comment }: PayloadAction<Comment>) => {
      state.items[comment.id] = comment;
    },
    commentUpdated: (state, { payload: comment }: PayloadAction<Comment>) => {
      Object.assign(state.items[comment.id], comment);
    },
    commentDeleted: (state, { payload: commentId }: PayloadAction<ID>) => {
      delete state.items[commentId];
    },
    commentsDeleted: (state, { payload: commentIds }: PayloadAction<ID[]>) => {
      for (const commentId of commentIds) {
        delete state.items[commentId];
      }
    },
  },
  extraReducers: (builder) => {},
});
