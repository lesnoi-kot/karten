import { schema } from "normalizr";

import { taskScheme } from "../tasks/utils";

export const taskListScheme = new schema.Entity("taskLists", {
  tasks: [taskScheme],
});
