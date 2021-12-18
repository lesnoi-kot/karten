import { ID, Task } from "models/types";
import { RootState } from "app";

import { TasksMap, sliceName } from "./slice";

export const selectTasks = (state: RootState): TasksMap =>
  state.entities[sliceName].items;

export const selectTaskById = (state: RootState, taskId: ID): Task | null =>
  selectTasks(state)[taskId] ?? null;

export const selectTaskNameById = (state: RootState, taskId: ID): string =>
  selectTasks(state)[taskId]?.name ?? "";
