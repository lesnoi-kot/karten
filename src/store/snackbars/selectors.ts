import { RootState } from "store";

export const selectState = (state: RootState) => state.widgets.snackbars;
