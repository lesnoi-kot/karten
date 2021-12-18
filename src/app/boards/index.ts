import { actions } from "./slice";
import * as selectors from "./selectors";

export const { boardsSet, boardSet, boardDeleted } = actions;
export * from "./slice";

export { selectors };
