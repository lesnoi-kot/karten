import { combineEpics } from "redux-observable";

import { epics as boardPageEpics } from "pages/Board";

import { epics as apiInteractionEpics } from "./apiInteraction";

import * as tasksEpics from "./tasks/epics";
import * as boardsEpics from "./boards/epics";
import * as taskListsEpics from "./taskLists/epics";

export const rootEpic = combineEpics(
  ...[
    // Entities
    tasksEpics,
    boardsEpics,
    taskListsEpics,

    // Slices
    apiInteractionEpics,

    // Pages
    boardPageEpics,

    // Components
  ].flatMap(Object.values),
);
