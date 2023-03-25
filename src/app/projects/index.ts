import { actions } from "./slice";
import * as selectors from "./selectors";

export * from "./slice";
export * from "./selectors";
export const {
  projectsSet,
  projectSet,
  projectDeleted,
  projectCleared,
  projectsDeleted,
} = actions;
export { selectors };
