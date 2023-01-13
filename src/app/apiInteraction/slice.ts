import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

import { ID } from "models/types";
import { FetchState } from "utils/types";

import {
  AddProjectArgs,
  AddBoardArgs,
  AddTaskArgs,
  EditProjectArgs,
  EditCommentArgs,
  AddCommentArgs,
  EditBoardArgs,
  EditTaskArgs,
  EditTaskListArgs,
  AddTaskListArgs,
} from "services/api";

import { WithError, APIAction, RequestInfo } from "./types";

export type TaskListMetaInfo = {
  taskAddState: FetchState;
};

export type APISlice = {
  taskLists: Record<ID, TaskListMetaInfo>;
  requestsInfo: Record<string, RequestInfo>;
};

const initialState: APISlice = {
  taskLists: {},
  requestsInfo: {},
};

// TODO: fix payload types for all actions

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
  name: "apiInteraction",
  initialState,
  reducers: {
    /*
      Meta actions
    */
    requestLoaded: {
      reducer: (state, { meta }: APIAction<null>) => {
        const { requestKey } = meta;
        state.requestsInfo[requestKey].state = FetchState.FULFILLED;
        delete state.requestsInfo[requestKey].error;
      },
      prepare: (requestKey: string) => ({
        payload: null,
        meta: { requestKey },
      }),
    },

    requestFailed: {
      reducer: (state, action: APIAction<any>) => {
        const { requestKey } = action.meta;
        state.requestsInfo[requestKey].error = action.payload;
        state.requestsInfo[requestKey].state = FetchState.FAILED;
      },
      prepare: (error: any, requestKey: string) => ({
        payload: error,
        meta: { requestKey },
      }),
    },

    /*
      Projects
    */
    getProjects: requestWithPayload<void>(),
    getProject: requestWithPayload<ID>(),
    addProject: requestWithPayload<AddProjectArgs>(),
    updateProject: requestWithPayload<EditProjectArgs>(),
    deleteProject: requestWithPayload<ID>(),

    /*
      Tasks
    */
    addTaskRequest: (state, { payload }: PayloadAction<AddTaskPayload>) => {
      state.taskLists[payload.taskListId] = {
        ...state.taskLists[payload.taskListId],
        taskAddState: FetchState.PENDING,
      };
    },
    addTaskRequestFailed: (
      state,
      { payload }: PayloadAction<TaskListId & WithError>,
    ) => {
      state.taskLists[payload.taskListId] = {
        ...state.taskLists[payload.taskListId],
        taskAddState: FetchState.FAILED,
      };
    },
    addTaskRequestLoaded: (state, { payload }: PayloadAction<TaskListId>) => {
      state.taskLists[payload.taskListId] = {
        ...state.taskLists[payload.taskListId],
        taskAddState: FetchState.FULFILLED,
      };
    },

    deleteTaskRequest: requestWithPayload<ID>(),
    deleteTasksRequest: requestWithPayload<ID[]>(),
    updateTaskRequest: requestWithPayload<EditTaskArgs>(),

    /* Sync server with a task in the local state */
    syncTaskRequest: requestWithPayload<ID>(),

    /*
      TaskLists
    */
    taskListRequest: requestWithPayload<ID>(),
    addTaskListRequest: requestWithPayload<AddTaskListArgs>(),

    addTaskListRequest: (state, action) => {
      state.taskListAddRequestState = FetchState.PENDING;
    },
    addTaskListRequestFailed: (state, action) => {
      state.taskListAddRequestState = FetchState.FAILED;
    },
    addTaskListRequestLoaded: (state) => {
      state.taskListAddRequestState = FetchState.FULFILLED;
    },

    deleteTaskListRequest: requestWithPayload<ID>(),
    updateTaskListRequest: requestWithPayload<EditTaskListArgs>(),
    clearTaskListRequest: requestWithPayload<ID>(),
    syncTaskListRequest: requestWithPayload<ID>(),

    /*
      Boards
    */
    boardRequest: (state, action: PayloadAction<ID>) => {},
    boardRequestFailed: (state, action) => {},
    boardRequestLoaded: (state) => {},

    updateBoardRequest: requestWithPayload<EditBoardArgs>(),
    clearBoardRequest: requestWithPayload<ID>(),

    deleteBoardRequest: requestWithPayload<ID>(),
    deleteBoardRequestLoaded: (state) => {},
    deleteBoardRequestFailed: (state, action: PayloadAction<string>) => {},


    /*
      Comments
    */
    addCommentRequest: requestWithPayload<AddCommentArgs>(),
    updateCommentRequest: requestWithPayload<EditCommentArgs>(),
    deleteCommentRequest: requestWithPayload<ID>(),
  },
  extraReducers: (builder) => {},
});

function requestWithPayload<P>() {
  return {
    reducer: (state: APISlice, action: APIAction<P>) => {
      state.requestsInfo[action.meta.requestKey] = {
        state: FetchState.PENDING,
        error: null,
        action,
      };
    },
    prepare: (payload: P, requestKey?: string) => ({
      payload,
      meta: { requestKey: requestKey ?? nanoid() },
    }),
  };
}
