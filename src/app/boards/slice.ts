import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { actions as projectsActions } from "app/projects";
import { ID, Board } from "models/types";

export type BoardsMap = Record<ID, Board>;

export type BoardsState = {
  items: BoardsMap;
};

const initialState: BoardsState = {
  items: {},
};

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
  name: "boards",
  initialState,
  reducers: {
    boardsSet: (state, { payload }: PayloadAction<BoardsMap>) => {
      Object.assign(state.items, payload);
    },
    boardSet: (state, { payload }: PayloadAction<Board>) => {
      state.items[payload.id] = payload;
    },
    boardDeleted: (state, { payload }: PayloadAction<ID>) => {
      delete state.items[payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      projectsActions.projectCleared,
      (state, { payload: projectId }: PayloadAction<ID>) => {
        for (const boardId in state.items) {
          if (state.items[boardId].projectId === projectId) {
            delete state.items[boardId];
          }
        }
      },
    );
  },
});
