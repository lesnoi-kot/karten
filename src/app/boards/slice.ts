import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ID, Board } from "models/types";

export type BoardsMap = Record<ID, Board>;

export type BoardsSlice = {
  items: BoardsMap;
};

const initialState: BoardsSlice = {
  items: {},
};

export const { actions, reducer, name: sliceName } = createSlice({
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
});
