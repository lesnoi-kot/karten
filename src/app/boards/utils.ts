import { schema, normalize } from "normalizr";

import { taskListScheme } from "../taskLists/utils";

const boardScheme = new schema.Entity("boards", {
  taskLists: [taskListScheme],
});

export const boardsScheme = [boardScheme];

export function normalizeBoards(data: any) {
  const normalized = normalize(data, boardsScheme);

  return {
    boards: normalized.entities.boards ?? {},
    taskLists: normalized.entities.taskLists ?? {},
    tasks: normalized.entities.tasks ?? {},
  };
}

export function normalizeBoard(data: any) {
  const normalized = normalize(data, boardScheme);

  return {
    boards: normalized.entities.boards ?? {},
    taskLists: normalized.entities.taskLists ?? {},
    tasks: normalized.entities.tasks ?? {},
    comments: normalized.entities.comments ?? {},
  };
}
