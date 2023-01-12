import { ID, Board, Project, Task, TaskList, Comment } from "models/types";

export type ResponseOK<T> = {
  error: null;
  data: T;
};

export type ResponseError<E = string> = {
  error: E;
};

export type CommentDTO = {
  id: ID;
  task_id: ID;
  author: string;
  text: string;
  date_created: string;
};

export type TaskDTO = {
  id: ID;
  task_list_id: ID;
  name: string;
  text: string;
  position: number;
  date_created: string;
  due_date: string;
  comments?: CommentDTO[];
};

export type TaskListDTO = {
  id: ID;
  board_id: ID;
  archived: boolean;
  position: number;
  name: string;
  date_created: string;
  color: number;
  tasks?: TaskDTO[];
};

export type BoardDTO = {
  id: ID;
  project_id: ID;
  archived: boolean;
  name: string;
  date_created: string;
  date_last_viewed: string;
  color: number;
  cover?: string | null;
  task_lists?: TaskListDTO[];
};

export type ProjectDTO = {
  id: ID;
  name: string;
  boards?: BoardDTO[];
};

export type AddProjectArgs = {
  name: string;
};

export type AddBoardArgs = {
  projectId: ID;
  name: string;
};

export type AddTaskListArgs = {
  boardId: ID;
  name: string;
};

export type AddTaskArgs = {
  taskListId: ID;
  name: string;
};

export type AddCommentArgs = {
  taskId: ID;
  text: string;
};

export type EditProjectArgs = {
  id: ID;
  name: string;
};

export type EditBoardArgs = Pick<BoardDTO, "id"> &
  Partial<Pick<BoardDTO, "name" | "color">>;

export type EditTaskListArgs = Pick<TaskListDTO, "id"> &
  Partial<Pick<TaskListDTO, "name" | "position">>;

export type EditTaskArgs = Pick<TaskDTO, "id"> &
  Partial<
    Pick<TaskDTO, "name" | "position" | "text" | "due_date" | "task_list_id">
  >;

export type EditCommentArgs = Pick<CommentDTO, "id"> &
  Partial<Pick<CommentDTO, "text">>;

export interface API {
  getProjects(): Promise<Project[]>;
  getProject(id: ID): Promise<Project>;
  addProject(args: AddProjectArgs): Promise<Project>;
  editProject(args: EditProjectArgs): Promise<Project>;
  deleteProject(id: ID): Promise<void>;

  getBoard(id: ID): Promise<Board>;
  addBoard(args: AddBoardArgs): Promise<Board>;
  editBoard(args: EditBoardArgs): Promise<Board>;
  deleteBoard(id: ID): Promise<void>;

  getTaskList(id: ID): Promise<TaskList>;
  addTaskList(args: AddTaskListArgs): Promise<TaskList>;
  editTaskList(args: EditTaskListArgs): Promise<TaskList>;
  deleteTaskList(id: ID): Promise<void>;

  getTask(id: ID): Promise<Task>;
  addTask(args: AddTaskArgs): Promise<Task>;
  editTask(args: EditTaskArgs): Promise<Task>;
  deleteTask(id: ID): Promise<void>;
  deleteTasks(args: ID[]): Promise<void>;

  addComment(args: AddCommentArgs): Promise<Comment>;
  editComment(args: EditCommentArgs): Promise<Comment>;
  deleteComment(id: ID): Promise<void>;
}

export const ERROR_CODES = {
  ERROR: "error", // Generic error code
};

export class APIError extends Error {
  code: string;

  constructor(code: string, message?: string) {
    super(message);
    this.code = code;
  }

  toString() {
    return this.code;
  }
}
