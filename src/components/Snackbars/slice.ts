import { AlertColor } from "@mui/lab";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "app";

type WidgetState = {
  isOpen: boolean;
  message: string;
  type: AlertColor;
};

export type ShowArgs = Omit<WidgetState, "isOpen">;

const initialState: WidgetState = {
  isOpen: false,
  message: "",
  type: "info",
};

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
  name: "snackbars",
  initialState,
  reducers: {
    show: (state, action: PayloadAction<ShowArgs>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    close: (state) => {
      state.isOpen = false;
    },
  },
});

export const { show: showSnackbar, close: closeSnackbar } = actions;

export const selectState = (state: RootState) => state.widgets.snackbars;
