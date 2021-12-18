import { ID } from "models/types";

export type TaskListId = {
  taskListId: ID;
};

export type WithError = {
  error: string;
};

export type DeleteTaskListPayload = {
  taskListId: ID;
  boardId: ID;
};

export type AddTaskPayload = {
  boardId: ID;
  taskListId: ID;
  title: string;
};

export type AddCommentPayload = {
  taskId: ID;
  text: string;
};

export type AddBoardPayload = {
  name: string;
};

export type UpdateTaskPayload = {
  taskId: ID;
  name?: string;
  text?: string;
  position?: number;
};

export type AddTaskListPayload = {
  boardId: ID;
  name: string;
};

export type UpdateTaskListPayload = {
  boardId: ID;
  taskListId: ID;
  name?: string;
};

export type ClearTaskListPayload = {
  taskListId: ID;
};

export type UpdateBoardPayload = {
  boardId: ID;
  name?: string;
};

export type UpdateCommentPayload = {
  commentId: ID;
  text?: string;
};

export type TaskDeletedPayload = {
  taskId: ID;
  taskListId: ID;
};

export type DeleteCommentPayload = {
  commentId: ID;
};

export type TasksDeletedPayload = {
  taskIds: ID[];
  taskListId: ID;
};
