import cookies from "js-cookie";

import {
  ID,
  Project,
  Board,
  TaskList,
  Task,
  Comment,
  KartenFile,
} from "models/types";

import {
  convertProjectDTO,
  convertBoardDTO,
  convertTaskListDTO,
  convertTaskDTO,
  convertCommentDTO,
  convertFilesDTO,
} from "./dtoToModel";

import {
  AddBoardArgs,
  AddCommentArgs,
  AddProjectArgs,
  AddTaskArgs,
  AddTaskListArgs,
  DataStore,
  APIError,
  BoardDTO,
  CommentDTO,
  EditBoardArgs,
  EditCommentArgs,
  EditProjectArgs,
  EditTaskArgs,
  EditTaskListArgs,
  FileDTO,
  ProjectDTO,
  ResponseError,
  ResponseOK,
  TaskDTO,
  TaskListDTO,
} from "./types";

const CSRF_COOKIE = "_csrf";
const CSRF_TOKEN_HEADER = "X-CSRF-Token";

const defaultFetchOptions = {
  mode: "cors",
  credentials: "include", // Send and receive cookies from the api endpoint.
} as const;

type FormBody = {
  [field: string]: string | null | Blob;
};

type JSONBody = {
  [field: string]: string | number | undefined | null | JSONBody;
};

export class APIService implements DataStore {
  apiRootURL: string;

  constructor(apiRootURL: string) {
    if (apiRootURL.endsWith("/")) {
      apiRootURL = apiRootURL.substring(0, apiRootURL.length - 1);
    }
    this.apiRootURL = apiRootURL;
  }

  private endpointURL(path: string): string {
    return `${this.apiRootURL}${path}`;
  }

  private async unwrapResponse<T>(response: globalThis.Response): Promise<T> {
    await this.checkResponseError(response);
    const body = (await response.json()) as ResponseOK<T>;
    return body.data;
  }

  private async checkResponseError(response: globalThis.Response) {
    if (response.status < 200 || response.status >= 300) {
      const body = (await response.json()) as ResponseError;
      throw new APIError(body.message, body.error);
    }
  }

  private fetchJSON(path: string, method = "GET", body?: JSONBody) {
    const headers = new Headers();
    const fetchOptions: RequestInit = {
      ...defaultFetchOptions,
      method,
      headers,
    };

    if (method !== "GET") {
      headers.append(CSRF_TOKEN_HEADER, cookies.get(CSRF_COOKIE) ?? "");
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body);
      headers.append("Content-Type", "application/json; charset=UTF-8");
    }

    return fetch(this.endpointURL(path), fetchOptions);
  }

  private fetchMultipart(path: string, method = "GET", body: FormBody) {
    const headers = new Headers();
    const form = new FormData();

    const fetchOptions: RequestInit = {
      ...defaultFetchOptions,
      method,
      headers,
      body: form,
    };

    headers.append(CSRF_TOKEN_HEADER, cookies.get(CSRF_COOKIE) ?? "");

    for (const key in body) {
      form.append(key, body[key] ?? "");
    }

    return fetch(this.endpointURL(path), fetchOptions);
  }

  async getProjects(): Promise<Project[]> {
    const res = await this.fetchJSON("/projects");
    const dtos = await this.unwrapResponse<ProjectDTO[]>(res);
    return dtos.map(convertProjectDTO);
  }

  async getProject(id: string): Promise<Project> {
    const res = await this.fetchJSON(`/projects/${id}`);
    return convertProjectDTO(await this.unwrapResponse<ProjectDTO>(res));
  }

  async editProject(args: EditProjectArgs): Promise<Project> {
    const res = await this.fetchJSON(`/projects/${args.id}`, "PATCH", {
      name: args.name,
    });
    return convertProjectDTO(await this.unwrapResponse<ProjectDTO>(res));
  }

  async addProject(args: AddProjectArgs): Promise<Project> {
    const res = await this.fetchMultipart(`/projects`, "POST", args);
    return convertProjectDTO(await this.unwrapResponse<ProjectDTO>(res));
  }

  async deleteProject(id: string) {
    const res = await this.fetchJSON(`/projects/${id}`, "DELETE");
    await this.checkResponseError(res);
  }

  /* ------------ */

  async getBoard(id: string): Promise<Board> {
    const res = await this.fetchJSON(`/boards/${id}`);
    return convertBoardDTO(await this.unwrapResponse<BoardDTO>(res));
  }

  async editBoard(args: EditBoardArgs): Promise<Board> {
    const res = await this.fetchJSON(`/projects/${args.id}`, "PATCH", {
      name: args.name,
    });
    return convertBoardDTO(await this.unwrapResponse<BoardDTO>(res));
  }

  async deleteBoard(id: string): Promise<void> {
    const res = await this.fetchJSON(`/boards/${id}`, "DELETE");
    await this.checkResponseError(res);
  }

  async addBoard(args: AddBoardArgs): Promise<Board> {
    const { projectId, name, color, cover, coverId } = args;
    const body: FormBody = { name };

    if (cover) {
      body.cover = cover;
    } else if (coverId) {
      body.cover_id = coverId;
    } else if (color) {
      body.color = String(color);
    }

    const res = await this.fetchMultipart(
      `/projects/${projectId}/boards`,
      "POST",
      body,
    );
    return convertBoardDTO(await this.unwrapResponse<BoardDTO>(res));
  }

  async favoriteBoard(id: ID) {
    const res = await this.fetchJSON(`/boards/${id}/favorite`, "PUT");
    await this.checkResponseError(res);
  }

  async unfavoriteBoard(id: ID) {
    const res = await this.fetchJSON(`/boards/${id}/favorite`, "DELETE");
    await this.checkResponseError(res);
  }

  /* ------------ */

  async getTaskList(id: string): Promise<TaskList> {
    const res = await this.fetchJSON(`/task-lists/${id}`);
    return convertTaskListDTO(await this.unwrapResponse<TaskListDTO>(res));
  }

  async editTaskList(args: EditTaskListArgs): Promise<TaskList> {
    const res = await this.fetchJSON(`/task-lists/${args.id}`, "PATCH", {
      name: args.name,
      position: args.position,
    });

    return convertTaskListDTO(await this.unwrapResponse<TaskListDTO>(res));
  }

  async deleteTaskList(id: string) {
    const res = await this.fetchJSON(`/task-lists/${id}`, "DELETE");
    await this.checkResponseError(res);
  }

  async addTaskList({ boardId, ...body }: AddTaskListArgs): Promise<TaskList> {
    const res = await this.fetchJSON(
      `/boards/${boardId}/task-lists`,
      "POST",
      body,
    );
    return convertTaskListDTO(await this.unwrapResponse<TaskListDTO>(res));
  }

  /* ------------ */

  async getTask(id: string): Promise<Task> {
    const res = await this.fetchJSON(`/tasks/${id}`);
    return convertTaskDTO(await this.unwrapResponse<TaskDTO>(res));
  }

  async editTask(args: EditTaskArgs): Promise<Task> {
    const res = await this.fetchJSON(`/tasks/${args.id}`, "PATCH", {
      name: args.name,
      position: args.position,
      text: args.text,
    });

    return convertTaskDTO(await this.unwrapResponse<TaskDTO>(res));
  }

  async deleteTask(id: string): Promise<void> {
    const res = await this.fetchJSON(`/tasks/${id}`, "DELETE");
    await this.checkResponseError(res);
  }

  async deleteTasks(args: ID[]): Promise<void> {
    throw new Error("Not implemented!");
  }

  async addTask(args: AddTaskArgs): Promise<Task> {
    const res = await this.fetchJSON(
      `/task-lists/${args.taskListId}/tasks`,
      "POST",
      {
        name: args.name,
        text: args.text ?? "",
        position: args.position,
      },
    );
    return convertTaskDTO(await this.unwrapResponse<TaskDTO>(res));
  }

  /* ------------ */

  async addComment({ taskId, text }: AddCommentArgs): Promise<Comment> {
    const res = await this.fetchJSON(`/tasks/${taskId}/comments`, "POST", {
      text,
    });
    return convertCommentDTO(await this.unwrapResponse<CommentDTO>(res));
  }

  async editComment({ id, text }: EditCommentArgs): Promise<Comment> {
    const res = await this.fetchJSON(`/comments/${id}`, "PATCH", { text });

    return convertCommentDTO(await this.unwrapResponse<CommentDTO>(res));
  }

  async deleteComment(id: string): Promise<void> {
    const res = await this.fetchJSON(`/comments/${id}`, "DELETE");
    await this.checkResponseError(res);
  }

  /* ------------ */

  async getBoardCovers(): Promise<KartenFile[]> {
    const res = await this.fetchJSON("/cover-images");
    return convertFilesDTO(await this.unwrapResponse<FileDTO[]>(res));
  }
}
