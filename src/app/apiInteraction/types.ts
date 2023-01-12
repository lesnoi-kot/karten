import { PayloadAction, AnyAction } from "@reduxjs/toolkit";

import { ID } from "models/types";
import { FetchState } from "utils/types";

export type RequestInfo = {
  state: FetchState;
  action: AnyAction;
  error: any;
};
export type WithRequestKey = { requestKey: string };
export type APIAction<T> = PayloadAction<T, string, WithRequestKey>;

export type TaskListId = {
  taskListId: ID;
};

export type WithError = {
  error: string;
};

export type AddProjectPayload = {
  name: string;
};

export type AddTaskPayload = {
  taskListId: ID;
  name: string;
};

export type AddCommentPayload = {
  taskId: ID;
  text: string;
};

export type AddBoardPayload = {
  projectId: ID;
  name: string;
};

export type AddTaskListPayload = {
  boardId: ID;
  name: string;
};

export type UpdateProjectPayload = {
  id: ID;
  name: string;
};

export type UpdateTaskListPayload = {
  id: ID;
  name?: string;
  position?: number;
};

export type UpdateBoardPayload = {
  id: ID;
  name?: string;
};

export type UpdateTaskPayload = {
  id: ID;
  name?: string;
  text?: string;
  position?: number;
};

export type UpdateCommentPayload = {
  id: ID;
  text?: string;
};
