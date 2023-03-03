import * as selectors from "./selectors";
import { actions } from "./slice";

export const { tasksSet, taskSet, taskUpdated, taskDeleted, tasksDeleted } =
  actions;
export * from "./slice";
export { selectors };
