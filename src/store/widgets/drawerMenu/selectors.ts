import { RootState } from "store";

import { sliceName } from "./slice";

export const selectIsOpen = (state: RootState): boolean =>
  state.widgets[sliceName].isOpen;
