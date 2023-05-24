import {
  Board,
  Comment,
  DateString,
  UserID,
  ID,
  KartenFile,
  KartenImageFile,
  Project,
  Task,
  TaskList,
  User,
  Label,
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
  user_id: UserID;
  author?: {
    id: ID;
    name: string;
    avatar_url: string;
    date_created: string;
  };
  text: string;
  html: string;
  date_created: string;
  attachments?: FileDTO[];
};

export type LabelDTO = {
  id: number;
  board_id: string;
  user_id: UserID;
  name: string;
  color: number;
};

export type TaskDTO = {
  id: ID;
  task_list_id: ID;
  user_id: UserID;
  name: string;
  text: string;
  html: string;
  position: number;
  date_created: string;
  date_started_tracking: string;
  spent_time: number;
  due_date: string;
  comments?: CommentDTO[];
  attachments?: FileDTO[];
  labels?: LabelDTO[];
};

export type TaskListDTO = {
  id: ID;
  board_id: ID;
  user_id: UserID;
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
  user_id: UserID;
  project_id: ID;
  archived: boolean;
  favorite: boolean;
  name: string;
  date_created: string;
  date_last_viewed: string;
  color: number;
  project_name: string;
  cover_url?: string;
  task_lists?: TaskListDTO[];
  labels?: LabelDTO[];
};

export type ProjectDTO = {
  id: ID;
  user_id: UserID;
  short_id: ID;
  name: string;
  avatar: ID | null;
  avatar_url?: string;
  avatar_thumbnail_url?: string;
  boards?: BoardDTO[];
};

export type UserDTO = {
  id: number;
  social_id: string;
  name: string;
  login: string;
  email: string;
  url: string;
  avatar_url: string;
  date_created: string;
};

export type FileDTO = {
  id: string;
  url: string;
  name: string;
  mime_type: string;
  size: number;
};

export type ImageFileDTO = FileDTO & {
  thumbnails: FileDTO[];
};

export type GetProjectsArgs = {
  includeBoards: boolean;
};

export type AddProjectArgs = {
  name: string;
  avatarId?: string;
};

export type AddBoardArgs = {
  projectId: ID;
  name: string;
  color?: number;
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
  position: number;
  text?: string;
  dueDate?: DateString | null;
};

export type AddCommentArgs = {
  taskId: ID;
  text: string;
  attachments?: ID[];
};

export type EditProjectArgs = {
  id: ID;
  name: string;
  avatarId?: ID;
};

export type EditBoardArgs = {
  id: ID;
  name?: string;
  color?: number;
  coverId?: ID | null;
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

export type AttachFileArgs = {
  id: ID;
  filesId: ID[];
};

export type EditCommentArgs = {
  id: ID;
  text: string;
};

export type UploadFile = {
  file: File;
};

export type UploadImage = {
  file: File;
  makeThumbnail: boolean;
};

export type TaskLabel = {
  taskId: ID;
  labelId: number;
};

export type AddLabelArgs = {
  boardId: ID;
  name: string;
  color: string;
};

export type EditLabelArgs = {
  labelId: number;
  name?: string;
  color?: string;
};

export interface DataStore {
  getCurrentUser(): Promise<User | null>;
  deleteUser(): Promise<void>;
  logOut(): Promise<void>;
  logInAsGuest(): Promise<User>;

  getProjects(args: GetProjectsArgs): Promise<Project[]>;
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
  clearTaskList(id: ID): Promise<void>;
  deleteTaskList(id: ID): Promise<void>;

  getTask(id: ID): Promise<Task>;
  addTask(args: AddTaskArgs): Promise<Task>;
  editTask(args: EditTaskArgs): Promise<Task>;
  deleteTask(id: ID): Promise<void>;
  attachFileToTask(args: AttachFileArgs): Promise<void>;
  startTaskTracking(id: ID): Promise<void>;
  stopTaskTracking(id: ID): Promise<void>;
  addLabelToTask(args: TaskLabel): Promise<void>;
  deleteLabelFromTask(args: TaskLabel): Promise<void>;

  getComment(id: ID): Promise<Comment>;
  addComment(args: AddCommentArgs): Promise<Comment>;
  editComment(args: EditCommentArgs): Promise<Comment>;
  deleteComment(id: ID): Promise<void>;
  attachFileToComment(args: AttachFileArgs): Promise<void>;

  getBoardCovers(): Promise<KartenFile[]>;
  uploadImage(args: UploadImage): Promise<KartenImageFile>;
  uploadFile(args: UploadFile): Promise<KartenFile>;
  deleteFile(id: ID): Promise<void>;

  addLabel(args: AddLabelArgs): Promise<Label>;
  editLabel(args: EditLabelArgs): Promise<Label>;
  deleteLabel(id: number): Promise<void>;
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
