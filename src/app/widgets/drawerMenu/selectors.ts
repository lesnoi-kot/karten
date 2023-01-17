import { RootState } from "app";

import { sliceName } from "./slice";

export const selectIsOpen = (state: RootState): boolean =>
  state.widgets[sliceName].isOpen;
