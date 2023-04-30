import * as taskListsEpics from "./taskListsEpics";
import * as tasksEpics from "./tasksEpics";
import * as commentsEpics from "./commentsEpics";
import * as usersEpics from "./usersEpics";

import * as selectors from "./selectors";

export const epics = {
  ...taskListsEpics,
  ...tasksEpics,
  ...commentsEpics,
  ...usersEpics,
};
export * from "./slice";
export { selectors };
