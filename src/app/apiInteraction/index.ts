import * as boardsEpics from "./boardsEpics";
import * as taskListsEpics from "./taskListsEpics";
import * as tasksEpics from "./tasksEpics";
import * as commentsEpics from "./commentsEpics";
import * as projectsEpics from "./projectsEpics";
import * as usersEpics from "./usersEpics";

import * as selectors from "./selectors";

export const epics = {
  ...boardsEpics,
  ...taskListsEpics,
  ...tasksEpics,
  ...commentsEpics,
  ...projectsEpics,
  ...usersEpics,
};
export * from "./slice";
export { selectors };
