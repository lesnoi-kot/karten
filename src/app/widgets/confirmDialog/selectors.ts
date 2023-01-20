import { RootState } from "app";

import { sliceName } from "./slice";

export const selectState = (state: RootState) => state.widgets[sliceName];
