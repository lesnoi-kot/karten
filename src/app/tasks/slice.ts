import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ID, Task } from "models/types";

export type TasksMap = Record<ID, Task>;

export type TasksSlice = {
  items: TasksMap;
};

const initialState: TasksSlice = {
  items: {},
};

export type TaskMovedPayload = {
  taskId: ID;
  dropTaskId?: ID;
  dropTaskListId?: ID;
  isBefore: boolean;
};

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    tasksSet: (state, { payload }: PayloadAction<TasksMap>) => {
      Object.assign(state.items, payload);
    },
    taskSet: (state, { payload: task }: PayloadAction<Task>) => {
      Object.assign(state.items[task.id], task);
    },
    taskUpdated: (state, { payload: task }: PayloadAction<Partial<Task>>) => {
      if (task.id) {
        Object.assign(state.items[task.id], task);
      }
    },
    taskDeleted: (state, { payload: taskId }: PayloadAction<ID>) => {
      delete state.items[taskId];
    },
    tasksDeleted: (state, { payload: taskIds }: PayloadAction<ID[]>) => {
      for (const taskId of taskIds) {
        delete state.items[taskId];
      }
    },
    taskMoved: (state, action: PayloadAction<TaskMovedPayload>) => {},
  },
});
