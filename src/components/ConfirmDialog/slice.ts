import {
  createSlice,
  PayloadAction,
  Action,
  AnyAction,
} from "@reduxjs/toolkit";

import { RootState } from "app";

type WidgetState = {
  isOpen: boolean;
  title: string;
  text: string;
  okAction: AnyAction | null;
  okButtonText?: string;
  cancelButtonText?: string;
};

export type ShowArgs = Omit<WidgetState, "isOpen">;

const initialState: WidgetState = {
  isOpen: false,
  title: "",
  text: "",
  okButtonText: "",
  cancelButtonText: "",
  okAction: null,
};

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
  name: "confirmDialog",
  initialState,
  reducers: {
    showDialog: (state, action: PayloadAction<ShowArgs>) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.text = action.payload.text;
      state.okAction = action.payload.okAction;
    },
    closeDialog: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export default reducer;
export const { showDialog, closeDialog } = actions;

export const selectState = (state: RootState) => state.widgets.confirmDialog;
