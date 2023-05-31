import { combineReducers } from "@reduxjs/toolkit";

import {
  reducer as projectsPageReducer,
  sliceName as projectsPageSliceName,
} from "pages/Projects/slice";

import {
  reducer as confirmDialogReducer,
  sliceName as confirmDialogSliceName,
} from "store/widgets/confirmDialog/slice";

import {
  reducer as snackbarsReducer,
  sliceName as snackbarsSliceName,
} from "store/snackbars/slice";

import {
  reducer as drawerMenuReducer,
  sliceName as drawerMenuSliceName,
} from "store/widgets/drawerMenu";

import {
  reducer as newBoardDialogReducer,
  sliceName as newBoardDialogSliceName,
} from "store/widgets/newBoardDialog";

export const rootReducer = combineReducers({
  pages: combineReducers({
    [projectsPageSliceName]: projectsPageReducer,
  }),

  widgets: combineReducers({
    [confirmDialogSliceName]: confirmDialogReducer,
    [snackbarsSliceName]: snackbarsReducer,
    [drawerMenuSliceName]: drawerMenuReducer,
    [newBoardDialogSliceName]: newBoardDialogReducer,
  }),
});
