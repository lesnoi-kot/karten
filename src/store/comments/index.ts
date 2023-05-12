import { actions } from "./slice";
import * as selectors from "./selectors";

export * from "./slice";
export const {
  commentSet,
  commentsSet,
  commentDeleted,
  commentUpdated,
  commentsDeleted,
} = actions;
export { selectors };
