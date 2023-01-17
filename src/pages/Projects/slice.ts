import { createSlice } from "@reduxjs/toolkit";

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
  extraReducers: (builder) => {},
});
