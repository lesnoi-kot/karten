import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ID, TaskList } from "models/types";

export type TaskListsMap = Record<ID, TaskList>;

export type TaskListsSlice = {
  items: TaskListsMap;
};

type TaskListUpdatedPayload = {
  taskListId: ID;
  name?: string;
};

const initialState: TaskListsSlice = {
  items: {},
};

export const { actions, reducer, name: sliceName } = createSlice({
  name: "taskLists",
  initialState,
  reducers: {
    taskListsSet: (state, { payload }: PayloadAction<TaskListsMap>) => {
      state.items = payload;
    },
    taskListSet: (state, { payload }: PayloadAction<TaskList>) => {
      state.items[payload.id] = payload;
    },
    taskListUpdated: (
      state,
      { payload }: PayloadAction<TaskListUpdatedPayload>
    ) => {
      if (payload.name) {
        state.items[payload.taskListId].name = payload.name;
      }
    },
    taskListDeleted: (state, { payload: taskListId }: PayloadAction<ID>) => {
      delete state.items[taskListId];
    },
    taskListsDeleted: (
      state,
      { payload: taskListIds }: PayloadAction<ID[]>
    ) => {
      for (const taskListId of taskListIds) {
        delete state.items[taskListId];
      }
    },
  },
});
