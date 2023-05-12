import { RootState } from "store";

import { sliceName } from "./slice";

export const selectState = (state: RootState) => state.widgets[sliceName];
