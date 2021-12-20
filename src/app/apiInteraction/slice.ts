import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

import { ID } from "models/types";
import { FetchState } from "utils/types";

import {
  AddBoardPayload,
  AddCommentPayload,
  AddTaskPayload,
  ClearTaskListPayload,
  DeleteTaskListPayload,
  DeleteCommentPayload,
  TaskDeletedPayload,
  TaskListId,
  TasksDeletedPayload,
  UpdateBoardPayload,
  UpdateTaskListPayload,
  UpdateCommentPayload,
  UpdateTaskPayload,
  WithError,
  APIAction,
  RequestKey,
  RequestInfo,
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

// const injectRequestId = <T>(payload: T) => ({
//   payload,
//   meta: {
//     requestId: nanoid(),
//   },
// });

const setRequestInitiated = <T>(state: APISlice, action: APIAction<T>) => {
  if (action.payload.requestKey) {
    state.requestsInfo[action.payload.requestKey] = {
      state: FetchState.PENDING,
      error: null,
      action,
    };
  }
};

export const {
  actions,
  reducer,
  name: sliceName,
} = createSlice({
  name: "apiInteraction",
  initialState,
  reducers: {
    requestLoaded: (state, { payload }: PayloadAction<RequestKey>) => {
      if (payload.requestKey) {
        delete state.requestsInfo[payload.requestKey];
      }
    },
    requestFailed: (state, action: PayloadAction<RequestKey & WithError>) => {
      const { requestKey, error } = action.payload;
      if (requestKey) {
        state.requestsInfo[requestKey].error = error;
        state.requestsInfo[requestKey].state = FetchState.FAILED;
      }
    },
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
      { payload }: PayloadAction<TaskListId & WithError>
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

    deleteTaskRequest: (state, action: PayloadAction<TaskDeletedPayload>) => {},
    deleteTaskRequestFailed: (state, action) => {},
    deleteTaskRequestLoaded: (state) => {},

    deleteTasksRequest: (
      state,
      action: PayloadAction<TasksDeletedPayload>
    ) => {},
    deleteTasksRequestFailed: (state, action: PayloadAction<string>) => {},
    deleteTasksRequestLoaded: (state) => {},

    updateTaskRequest: (state, action: PayloadAction<UpdateTaskPayload>) => {},
    updateTaskRequestFailed: (state, action: PayloadAction<string>) => {},
    updateTaskRequestLoaded: (state) => {},

    /*
      TaskLists
    */
    taskListRequest: (state, action) => {},
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

    deleteTaskListRequest: (
      state,
      action: PayloadAction<DeleteTaskListPayload>
    ) => {},
    deleteTaskListRequestFailed: (state, action) => {},
    deleteTaskListRequestLoaded: (state) => {},

    updateTaskListRequest: (
      state,
      action: PayloadAction<UpdateTaskListPayload>
    ) => {},
    updateTaskListRequestFailed: (state, action) => {},
    updateTaskListRequestLoaded: (state) => {},

    clearTaskListRequest: (
      state,
      action: PayloadAction<ClearTaskListPayload>
    ) => {},

    /*
      Boards
    */
    boardsRequest: (state) => {},
    boardsRequestFailed: (state, action: PayloadAction<Error | null>) => {},
    boardsRequestLoaded: (state) => {},

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
      action: PayloadAction<UpdateBoardPayload>
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
    addCommentRequest: (state, action: APIAction<AddCommentPayload>) =>
      setRequestInitiated(state, action),

    deleteCommentRequest: (
      state,
      action: PayloadAction<DeleteCommentPayload>
    ) => {},
    deleteCommentRequestLoaded: (state) => {},
    deleteCommentRequestFailed: (state, action: PayloadAction<string>) => {},

    updateCommentRequest: (state, action: APIAction<UpdateCommentPayload>) =>
      setRequestInitiated(state, action),
  },
  extraReducers: (builder) => {},
});
