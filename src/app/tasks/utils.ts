import { schema } from "normalizr";

import { commentScheme } from "../comments/utils";

export const taskScheme = new schema.Entity("tasks", {
  comments: [commentScheme],
});
