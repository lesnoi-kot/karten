import { combineReducers } from "@reduxjs/toolkit";

import {
  reducer as boardPageReducer,
  sliceName as boardPageSliceName,
} from "pages/Board/slice";

import {
  reducer as projectsPageReducer,
  sliceName as projectsPageSliceName,
} from "pages/Projects/slice";

import {
  reducer as confirmDialogReducer,
  sliceName as confirmDialogSliceName,
} from "app/widgets/confirmDialog/slice";

import {
  reducer as snackbarsReducer,
  sliceName as snackbarsSliceName,
} from "app/snackbars/slice";

import {
  reducer as drawerMenuReducer,
  sliceName as drawerMenuSliceName,
} from "app/widgets/drawerMenu";

import {
  reducer as newBoardDialogReducer,
  sliceName as newBoardDialogSliceName,
} from "app/widgets/newBoardDialog";

import {
  reducer as projectsReducer,
  sliceName as projectsSliceName,
} from "./projects";

import {
  reducer as taskListsReducer,
  sliceName as taskListsSliceName,
} from "./taskLists";

import { reducer as tasksReducer, sliceName as tasksSliceName } from "./tasks";

import {
  reducer as commentsReducer,
  sliceName as commentsSliceName,
} from "./comments";

import {
  reducer as boardsReducer,
  sliceName as boardsSliceName,
} from "./boards";

import {
  reducer as apiInteractionReducer,
  sliceName as apiInteractionSliceName,
} from "./apiInteraction";

export const rootReducer = combineReducers({
  [apiInteractionSliceName]: apiInteractionReducer,

  entities: combineReducers({
    [projectsSliceName]: projectsReducer,
    [boardsSliceName]: boardsReducer,
    [taskListsSliceName]: taskListsReducer,
    [tasksSliceName]: tasksReducer,
    [commentsSliceName]: commentsReducer,
  }),

  pages: combineReducers({
    [boardPageSliceName]: boardPageReducer,
    [projectsPageSliceName]: projectsPageReducer,
  }),

  widgets: combineReducers({
    [confirmDialogSliceName]: confirmDialogReducer,
    [snackbarsSliceName]: snackbarsReducer,
    [drawerMenuSliceName]: drawerMenuReducer,
    [newBoardDialogSliceName]: newBoardDialogReducer,
  }),
});
