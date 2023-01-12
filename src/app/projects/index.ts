import { actions } from "./slice";
import * as selectors from "./selectors";

export * from "./slice";
export const { projectsSet, projectSet, projectDeleted } = actions;
export { selectors };
