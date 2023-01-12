import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

import { ID } from "models/types";
import { FetchState } from "utils/types";

import {
  AddBoardPayload,
  AddCommentPayload,
  AddProjectPayload,
  AddTaskPayload,
  UpdateBoardPayload,
  UpdateTaskListPayload,
  UpdateCommentPayload,
  UpdateProjectPayload,
  UpdateTaskPayload,
  WithError,
  APIAction,
  WithRequestKey,
  RequestInfo,
  TaskListId,
} from "./types";

export type TaskListMetaInfo = {
  taskAddState: FetchState;
};

export type APISlice = {
  boardAddRequestState: FetchState;
  taskListAddRequestState: FetchState;
  taskLists: Record<ID, TaskListMetaInfo>;
  requestsInfo: Record<string, RequestInfo>;
};

const initialState: APISlice = {
  taskListAddRequestState: FetchState.INITIAL,
  boardAddRequestState: FetchState.INITIAL,
  taskLists: {},
  requestsInfo: {},
};

const setRequestInitiated = <S extends APISlice, T>(
  state: S,
  action: APIAction<T>,
) => {
  state.requestsInfo[action.meta.requestKey] = {
    state: FetchState.PENDING,
    error: null,
    action,
  };
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
    addProject: requestWithPayload<AddProjectPayload>(),
    updateProject: requestWithPayload<UpdateProjectPayload>(),
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

    deleteTaskRequest: (state, action: PayloadAction<ID>) => {},
    deleteTaskRequestFailed: (state, action) => {},
    deleteTaskRequestLoaded: (state) => {},

    deleteTasksRequest: (state, action: PayloadAction<ID[]>) => {},
    deleteTasksRequestFailed: (state, action: PayloadAction<string>) => {},
    deleteTasksRequestLoaded: (state) => {},

    updateTaskRequest: (state, action: PayloadAction<UpdateTaskPayload>) => {},
    updateTaskRequestFailed: (state, action: PayloadAction<string>) => {},
    updateTaskRequestLoaded: (state) => {},

    /* Sync server with a task in the local state */
    syncTaskRequest: (state, action: PayloadAction<ID>) => {},

    /*
      TaskLists
    */
    taskListRequest: (state, action: PayloadAction<ID>) => {},
    taskListRequestFailed: (state, action) => {},
    taskListRequestLoaded: (state) => {},

    addTaskListRequest: (state, action) => {
      state.taskListAddRequestState = FetchState.PENDING;
    },
    addTaskListRequestFailed: (state, action) => {
      state.taskListAddRequestState = FetchState.FAILED;
    },
    addTaskListRequestLoaded: (state) => {
      state.taskListAddRequestState = FetchState.FULFILLED;
    },

    deleteTaskListRequest: (state, action: PayloadAction<ID>) => {},
    deleteTaskListRequestFailed: (state, action) => {},
    deleteTaskListRequestLoaded: (state) => {},

    updateTaskListRequest: (
      state,
      action: PayloadAction<UpdateTaskListPayload>,
    ) => {},
    updateTaskListRequestFailed: (state, action) => {},
    updateTaskListRequestLoaded: (state) => {},

    clearTaskListRequest: (state, action: PayloadAction<ID>) => {},
    syncTaskListRequest: (state, action: PayloadAction<ID>) => {},

    /*
      Boards
    */
    boardRequest: (state, action: PayloadAction<ID>) => {},
    boardRequestFailed: (state, action) => {},
    boardRequestLoaded: (state) => {},

    addBoardRequest: (state, action: PayloadAction<AddBoardPayload>) => {
      state.boardAddRequestState = FetchState.PENDING;
    },
    addBoardRequestLoaded: (state) => {
      state.boardAddRequestState = FetchState.FULFILLED;
    },
    addBoardRequestFailed: (state, action: PayloadAction<string>) => {
      state.boardAddRequestState = FetchState.FAILED;
    },

    updateBoardRequest: (
      state,
      action: PayloadAction<UpdateBoardPayload>,
    ) => {},
    updateBoardRequestLoaded: (state) => {},
    updateBoardRequestFailed: (state, action: PayloadAction<string>) => {},

    deleteBoardRequest: (state, action: PayloadAction<ID>) => {},
    deleteBoardRequestLoaded: (state) => {},
    deleteBoardRequestFailed: (state, action: PayloadAction<string>) => {},

    clearBoardRequest: (state, action: PayloadAction<ID>) => {},
    clearBoardRequestLoaded: (state) => {},
    clearBoardRequestFailed: (state, action: PayloadAction<string>) => {},

    /*
      Comments
    */
    addCommentRequest: (
      state,
      action: PayloadAction<AddCommentPayload & WithRequestKey>,
    ) => {
      // setRequestInitiated(state, action);
    },

    deleteCommentRequest: (state, action: PayloadAction<ID>) => {},
    deleteCommentRequestLoaded: (state) => {},
    deleteCommentRequestFailed: (state, action: PayloadAction<string>) => {},

    updateCommentRequest: (
      state,
      action: PayloadAction<UpdateCommentPayload & WithRequestKey>,
    ) => {
      // setRequestInitiated(state, action),
    },
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
