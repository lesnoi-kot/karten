import { createSlice, PayloadAction, AnyAction } from "@reduxjs/toolkit";

type WidgetState = {
  isOpen: boolean;
  isLoading: boolean;
  closeOnOk: boolean;
  title: string;
  text: string;
  okAction: AnyAction | null;
  okCallback: (() => void) | null;
  okButtonText: string;
  cancelButtonText: string;
};

export type ShowArgs = Partial<WidgetState> & {
  text: string;
};

const initialState: WidgetState = {
  isOpen: false,
  isLoading: false,
  closeOnOk: false,
  title: "",
  text: "",
  okButtonText: "",
  cancelButtonText: "",
  okAction: null,
  okCallback: null,
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
      state.closeOnOk = action.payload.closeOnOk ?? false;
      state.title = action.payload.title ?? "Warning";
      state.text = action.payload.text;
      state.okAction = action.payload.okAction ?? null;
      state.okCallback = action.payload.okCallback ?? null;
      state.okButtonText = action.payload.okButtonText ?? "Ok";
      state.cancelButtonText = action.payload.cancelButtonText ?? "Cancel";
    },
    setDialogLoading: (state) => {
      state.isLoading = true;
    },
    setDialogNotLoading: (state) => {
      state.isLoading = false;
    },
    closeDialog: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export default reducer;
