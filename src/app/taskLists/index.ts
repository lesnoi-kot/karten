import { actions } from "./slice";
import * as selectors from "./selectors";

export const {
  taskListsSet,
  taskListSet,
  taskListDeleted,
  taskListUpdated,
} = actions;
export * from "./slice";
export { selectors };
