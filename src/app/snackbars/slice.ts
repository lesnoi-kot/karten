import { AlertColor } from "@mui/lab";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Snackbar = {
  message: string;
  type: AlertColor;
};

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
    showSnackbar: (state, action: PayloadAction<ShowArgs>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.message = String(action.payload.message);
    },
    closeSnackbar: (state) => {
      state.isOpen = false;
    },
  },
});
