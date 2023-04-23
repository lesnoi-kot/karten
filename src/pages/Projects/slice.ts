import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "app";

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
  name: "projects",
  initialState: {
    newProjectDialogOpened: false,
  },
  reducers: {
    showNewProjectDialog: (state) => {
      state.newProjectDialogOpened = true;
    },
    closeNewProjectDialog: (state) => {
      state.newProjectDialogOpened = false;
    },
  },
});

export const selectIsNewProjectDialogOpened = (state: RootState): boolean =>
  state.pages.projects.newProjectDialogOpened;
