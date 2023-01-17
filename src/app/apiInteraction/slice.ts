import { createSlice, nanoid } from "@reduxjs/toolkit";

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

import { APIAction, RequestInfo } from "./types";

export type APISlice = {
  requestsInfo: Record<string, RequestInfo>;
};

const initialState: APISlice = {
  requestsInfo: {},
};

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
      reducer: (state, action: APIAction<string>) => {
        const { requestKey } = action.meta;
        state.requestsInfo[requestKey].error = action.payload;
        state.requestsInfo[requestKey].state = FetchState.FAILED;
      },
      prepare: (error: unknown, requestKey: string) => ({
        payload: String(error),
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
    addTaskRequest: requestWithPayload<AddTaskArgs>(),
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
    deleteTaskListRequest: requestWithPayload<ID>(),
    updateTaskListRequest: requestWithPayload<EditTaskListArgs>(),
    clearTaskListRequest: requestWithPayload<ID>(),
    syncTaskListRequest: requestWithPayload<ID>(),

    /*
      Boards
    */
    boardRequest: requestWithPayload<ID>(),
    updateBoardRequest: requestWithPayload<EditBoardArgs>(),
    clearBoardRequest: requestWithPayload<ID>(),
    addBoardRequest: requestWithPayload<AddBoardArgs>(),
    deleteBoardRequest: requestWithPayload<ID>(),

    /*
      Comments
    */
    addCommentRequest: requestWithPayload<AddCommentArgs>(),
    updateCommentRequest: requestWithPayload<EditCommentArgs>(),
    deleteCommentRequest: requestWithPayload<ID>(),
  },
});

function requestWithPayload<P>() {
  return {
    reducer: (state: APISlice, action: APIAction<P>) => {
      state.requestsInfo[action.meta.requestKey] = {
        state: FetchState.PENDING,
        action,
      };
    },
    prepare: (payload: P, requestKey?: string) => ({
      payload,
      meta: { requestKey: requestKey ?? nanoid() },
    }),
  };
}
