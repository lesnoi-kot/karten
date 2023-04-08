import {
  Board,
  Comment,
  ID,
  KartenFile,
  Project,
  Task,
  TaskList,
  User,
} from "models/types";

export type ResponseOK<T> = {
  data: T;
};

export type ResponseError = {
  message: string;
  error?: string;
};

export type RequestOptions = {
  signal?: AbortSignal;
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
  short_id: ID;
  project_id: ID;
  archived: boolean;
  favorite: boolean;
  name: string;
  date_created: string;
  date_last_viewed: string;
  color: number;
  cover_url?: string;
  task_lists?: TaskListDTO[];
};

export type ProjectDTO = {
  id: ID;
  short_id: ID;
  name: string;
  avatar: ID | null;
  avatar_url?: string;
  avatar_thumbnail_url?: string;
  boards?: BoardDTO[];
};

export type UserDTO = {
  id: string;
  social_id: string;
  name: string;
  login: string;
  email: string;
  url: string;
  date_created: string;
};

export type FileDTO = {
  id: string;
  url: string;
  name: string;
  mime_type: string;
  size: number;
};

export type AddProjectArgs = {
  name: string;
  avatar: File | null;
};

export type AddBoardArgs = {
  projectId: ID;
  name: string;
  color?: number;
  cover?: File | null;
  coverId?: string | null;
};

export type AddTaskListArgs = {
  boardId: ID;
  name: string;
  color?: number;
  position?: number;
};

export type AddTaskArgs = {
  taskListId: ID;
  name: string;
  text?: string;
  position: number;
};

export type AddCommentArgs = {
  taskId: ID;
  text: string;
};

export type EditProjectArgs = {
  id: ID;
  name: string;
};

export type EditBoardArgs = {
  id: ID;
  name?: string;
  color?: number;
};

export type EditTaskListArgs = {
  id: ID;
  name?: string;
  position?: number;
};

export type EditTaskArgs = {
  id: ID;
  taskListId?: ID;
  name?: string;
  position?: number;
  text?: string;
  dueDate?: string;
};

export type EditCommentArgs = {
  id: ID;
  text: string;
};

export interface DataStore {
  getCurrentUser(): Promise<User | null>;

  getProjects(): Promise<Project[]>;
  getProject(id: ID): Promise<Project>;
  addProject(args: AddProjectArgs): Promise<Project>;
  editProject(args: EditProjectArgs): Promise<Project>;
  deleteProject(id: ID): Promise<void>;
  clearProject(id: ID): Promise<void>;
  deleteAllProjects(): Promise<void>;

  getBoard(id: ID): Promise<Board>;
  addBoard(args: AddBoardArgs): Promise<Board>;
  editBoard(args: EditBoardArgs): Promise<Board>;
  deleteBoard(id: ID): Promise<void>;
  favoriteBoard(id: ID): Promise<void>;
  unfavoriteBoard(id: ID): Promise<void>;

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

  getBoardCovers(): Promise<KartenFile[]>;
}

export const ERROR_CODES = {
  ERROR: "error", // Generic error code
};

export class APIError extends Error {
  code: string;

  constructor(code: string, message?: string) {
    super(message ?? "");
    this.code = code;
  }

  toString() {
    return `${this.code}; ${this.message}`;
  }
}
