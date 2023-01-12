import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ID, Project } from "models/types";

export type ProjectsMap = Record<ID, Project>;

export type ProjectsState = {
  items: ProjectsMap;
};

const initialState: ProjectsState = {
  items: {},
};

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
  name: "projects",
  initialState,
  reducers: {
    projectsSet: (state, { payload }: PayloadAction<ProjectsMap>) => {
      Object.assign(state.items, payload);
    },
    projectSet: (state, { payload }: PayloadAction<Project>) => {
      state.items[payload.id] = payload;
    },
    projectDeleted: (state, { payload }: PayloadAction<ID>) => {
      delete state.items[payload];
    },
  },
});
