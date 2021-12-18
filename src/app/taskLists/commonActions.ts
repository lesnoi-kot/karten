import { createAction } from "@reduxjs/toolkit";

import { ID } from "models/types";

export const taskListCleared = createAction<{ taskListId: ID }>(
  "taskLists/taskListCleared"
);
