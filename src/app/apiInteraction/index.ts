import * as boardsEpics from "./boardsEpics";
import * as taskListsEpics from "./taskListsEpics";
import * as tasksEpics from "./tasksEpics";
import * as commentsEpics from "./commentsEpics";
import * as selectors from "./selectors";

export const epics = {
  ...boardsEpics,
  ...taskListsEpics,
  ...tasksEpics,
  ...commentsEpics,
};
export * from "./slice";
export { selectors };
