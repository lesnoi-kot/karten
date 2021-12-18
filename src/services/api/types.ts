import { ID, Project, Board, TaskList, Task, Comment } from "models/types";

export type Response<T> =
  | {
      error: null;
      data: T;
    }
  | {
      error: string;
      data?: null;
    };

export type ById = {
  id: ID;
};

export type TaskDTO = Omit<Task, "comments"> & { comments: Comment[] };
export type TaskListDTO = Omit<TaskList, "tasks"> & { tasks: TaskDTO[] };
export type BoardDTO = Omit<Board, "taskLists"> & { taskLists?: TaskListDTO[] };
export type ProjectDTO = Omit<Project, "boards"> & { boards: BoardDTO[] };

export type BoardPreview = Pick<BoardDTO, "id" | "name" | "dateLastViewed">;
export type GetOverviewResponse = {
  boards: BoardPreview[];
};

export type AddTaskArgs = {
  boardId: ID;
  taskListId: ID;
  task: { name: string };
};

export type AddCommentArgs = {
  taskId: ID;
} & Partial<Pick<Comment, "text">>;

export type DeleteTaskArgs = {
  taskId: ID;
};

export type DeleteTaskListArgs = {
  boardId: ID;
  taskListId: ID;
};

export type EditTaskListArgs = {
  boardId: ID;
  taskListId: ID;
  name?: string;
};

export type GetTaskListArgs = {
  boardId: ID;
  taskListId: ID;
};

export type AddBoardArgs = {
  name: string;
};

export type AddTaskListArgs = {
  boardId: ID;
  name: string;
};

export type DeleteTasksArgs = {
  taskListId: ID;
  taskIds: ID[];
};

export type EditTaskArgs = {
  taskId: ID;
} & Partial<Pick<Task, "name" | "position" | "text" | "dueDate">>;

export type EditCommentArgs = {
  commentId: ID;
} & Partial<Pick<Comment, "text">>;

export type DeleteBoardArgs = {
  boardId: ID;
};

export interface API {
  getProjects?(): Promise<Response<ProjectDTO[]>>;
  addProject?(): Promise<Response<ProjectDTO>>;

  getOverview(): Promise<Response<GetOverviewResponse>>;

  getBoards(): Promise<Response<Board[]>>;
  getBoard({ id }: { id: ID }): Promise<Response<BoardDTO>>;
  addBoard(arg: AddBoardArgs): Promise<Response<Board>>;
  editBoard(board: Partial<Board>): Promise<Response<BoardDTO>>;
  deleteBoard(arg: DeleteBoardArgs): Promise<Response<null>>;

  getTaskList(arg: GetTaskListArgs): Promise<Response<TaskListDTO>>;
  addTaskList(arg: AddTaskListArgs): Promise<Response<TaskList>>;
  deleteTaskList(arg: DeleteTaskListArgs): Promise<Response<null>>;
  editTaskList(arg: EditTaskListArgs): Promise<Response<null>>;

  addTask(arg: AddTaskArgs): Promise<Response<Task>>;
  editTask(arg: EditTaskArgs): Promise<Response<Task>>;
  deleteTask(arg: DeleteTaskArgs): Promise<Response<null>>;
  deleteTasks(arg: DeleteTasksArgs): Promise<Response<null>>;

  addComment(arg: AddCommentArgs): Promise<Response<Comment>>;
  editComment(arg: EditCommentArgs): Promise<Response<Comment>>;
  deleteComment(arg: ById): Promise<Response<null>>;
}

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
