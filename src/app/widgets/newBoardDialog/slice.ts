import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "app";
import { ID } from "models/types";

type WidgetState = {
  isOpen: boolean;
  projectId: ID | null;
};

const initialState: WidgetState = {
  isOpen: false,
  projectId: null,
};

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
  name: "newBoardDialog",
  initialState,
  reducers: {
    showDialog: (state, action: PayloadAction<ID>) => {
      state.isOpen = true;
      state.projectId = action.payload;
    },
    closeDialog: (state) => {
      state.isOpen = false;
    },
  },
});

export const selectNewBoardDialogWidgetState = (state: RootState) =>
  state.widgets[sliceName];
