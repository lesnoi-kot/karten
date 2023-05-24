import cookies from "js-cookie";
import { filter } from "ramda";

import { hexColorToNumber } from "utils/color";
import {
  Board,
  Comment,
  ID,
  KartenFile,
  KartenImageFile,
  Label,
  Project,
  Task,
  TaskList,
  User,
} from "models/types";

import {
  convertBoardDTO,
  convertCommentDTO,
  convertFileDTO,
  convertFilesDTO,
  convertImageFileDTO,
  convertLabelDTO,
  convertProjectDTO,
  convertTaskDTO,
  convertTaskListDTO,
  convertUserDTO,
} from "./dtoToModel";

import {
  AddBoardArgs,
  AddCommentArgs,
  AddLabelArgs,
  AddProjectArgs,
  AddTaskArgs,
  AddTaskListArgs,
  APIError,
  AttachFileArgs,
  BoardDTO,
  CommentDTO,
  DataStore,
  EditBoardArgs,
  EditCommentArgs,
  EditLabelArgs,
  EditProjectArgs,
  EditTaskArgs,
  EditTaskListArgs,
  FileDTO,
  GetProjectsArgs,
  ImageFileDTO,
  LabelDTO,
  ProjectDTO,
  ResponseError,
  ResponseOK,
  TaskDTO,
  TaskLabel,
  TaskListDTO,
  UploadFile,
  UploadImage,
  UserDTO,
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

type PlainData = string | number;

type JSONBody = {
  [field: string]: PlainData | PlainData[] | undefined | null | JSONBody;
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
      fetchOptions.body = JSON.stringify(filter((v) => v !== undefined, body));
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

  async getProjects({ includeBoards }: GetProjectsArgs): Promise<Project[]> {
    const queryParams = includeBoards ? "?include=boards" : "";
    const res = await this.fetchJSON(`/projects${queryParams}`);
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
    const res = await this.fetchJSON(`/projects`, "POST", {
      name: args.name,
      avatar_id: args.avatarId,
    });
    return convertProjectDTO(await this.unwrapResponse<ProjectDTO>(res));
  }

  async deleteProject(id: string) {
    const res = await this.fetchJSON(`/projects/${id}`, "DELETE");
    await this.checkResponseError(res);
  }

  async clearProject(projectId: ID) {
    const res = await this.fetchJSON(`/projects/${projectId}/boards`, "DELETE");
    await this.checkResponseError(res);
  }

  async deleteAllProjects() {
    const res = await this.fetchJSON(`/projects/`, "DELETE");
    await this.checkResponseError(res);
  }

  /* ------------ */

  async getBoard(id: string): Promise<Board> {
    const res = await this.fetchJSON(`/boards/${id}`);
    return convertBoardDTO(await this.unwrapResponse<BoardDTO>(res));
  }

  async editBoard(args: EditBoardArgs): Promise<Board> {
    const res = await this.fetchJSON(`/boards/${args.id}`, "PATCH", {
      name: args.name,
      color: args.color,
      cover_id: args.coverId,
    });
    return convertBoardDTO(await this.unwrapResponse<BoardDTO>(res));
  }

  async deleteBoard(id: string): Promise<void> {
    const res = await this.fetchJSON(`/boards/${id}`, "DELETE");
    await this.checkResponseError(res);
  }

  async addBoard(args: AddBoardArgs): Promise<Board> {
    const { projectId, name, color, coverId } = args;
    const body: JSONBody = { name };

    if (coverId) {
      body.cover_id = coverId;
    } else if (color) {
      body.color = color;
    }

    const res = await this.fetchJSON(
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

  async getTaskList(id: ID): Promise<TaskList> {
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

  async clearTaskList(id: ID) {
    const res = await this.fetchJSON(`/task-lists/${id}/tasks`, "DELETE");
    await this.checkResponseError(res);
  }

  async deleteTaskList(id: ID) {
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

  async getTask(id: ID): Promise<Task> {
    const res = await this.fetchJSON(`/tasks/${id}`);
    return convertTaskDTO(await this.unwrapResponse<TaskDTO>(res));
  }

  async editTask(args: EditTaskArgs): Promise<Task> {
    const res = await this.fetchJSON(`/tasks/${args.id}`, "PATCH", {
      name: args.name,
      position: args.position,
      text: args.text,
      task_list_id: args.taskListId,
    });

    return convertTaskDTO(await this.unwrapResponse<TaskDTO>(res));
  }

  async deleteTask(id: ID): Promise<void> {
    const res = await this.fetchJSON(`/tasks/${id}`, "DELETE");
    await this.checkResponseError(res);
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

  async attachFileToTask({ id, filesId }: AttachFileArgs) {
    const res = await this.fetchJSON(`/tasks/${id}/attachments`, "POST", {
      files_id: filesId,
    });
    await this.checkResponseError(res);
  }

  async addLabelToTask({ taskId, labelId }: TaskLabel) {
    const res = await this.fetchJSON(`/tasks/${taskId}/labels`, "POST", {
      label_id: labelId,
    });
    await this.checkResponseError(res);
  }

  async deleteLabelFromTask({ taskId, labelId }: TaskLabel) {
    const res = await this.fetchJSON(`/tasks/${taskId}/labels`, "DELETE", {
      label_id: labelId,
    });
    await this.checkResponseError(res);
  }

  async startTaskTracking(id: ID) {
    const res = await this.fetchJSON(`/tasks/${id}/tracking`, "POST");
    await this.checkResponseError(res);
  }

  async stopTaskTracking(id: ID) {
    const res = await this.fetchJSON(`/tasks/${id}/tracking`, "DELETE");
    await this.checkResponseError(res);
  }

  /* ------------ */

  async getComment(id: ID): Promise<Comment> {
    const res = await this.fetchJSON(`/comments/${id}`);
    return convertCommentDTO(await this.unwrapResponse<CommentDTO>(res));
  }

  async addComment({
    taskId,
    text,
    attachments,
  }: AddCommentArgs): Promise<Comment> {
    const res = await this.fetchJSON(`/tasks/${taskId}/comments`, "POST", {
      text,
      attachments,
    });
    return convertCommentDTO(await this.unwrapResponse<CommentDTO>(res));
  }

  async editComment({ id, text }: EditCommentArgs): Promise<Comment> {
    const res = await this.fetchJSON(`/comments/${id}`, "PATCH", { text });
    return convertCommentDTO(await this.unwrapResponse<CommentDTO>(res));
  }

  async deleteComment(id: ID): Promise<void> {
    const res = await this.fetchJSON(`/comments/${id}`, "DELETE");
    await this.checkResponseError(res);
  }

  async attachFileToComment({ id, filesId }: AttachFileArgs) {
    const res = await this.fetchJSON(`/comments/${id}/attachments`, "POST", {
      files_id: filesId,
    });
    await this.checkResponseError(res);
  }

  /* ------------ */

  async getBoardCovers(): Promise<KartenFile[]> {
    const res = await this.fetchJSON("/cover-images");
    return convertFilesDTO(await this.unwrapResponse<FileDTO[]>(res));
  }

  /* ------------ */

  async getCurrentUser(): Promise<User | null> {
    const res = await this.fetchJSON("/users/self");

    if (res.status === 200) {
      return convertUserDTO(await this.unwrapResponse<UserDTO>(res));
    }

    return null;
  }

  async deleteUser(): Promise<void> {
    const res = await this.fetchJSON("/users/self", "DELETE");
    await this.checkResponseError(res);
  }

  async logOut() {
    const res = await this.fetchJSON("/users/self/logout", "POST");
    await this.checkResponseError(res);
  }

  async logInAsGuest(): Promise<User> {
    const res = await this.fetchJSON("/login", "POST");
    return convertUserDTO(await this.unwrapResponse<UserDTO>(res));
  }

  /* ------------ */

  async uploadFile(args: UploadFile): Promise<KartenFile> {
    const res = await this.fetchMultipart(`/files`, "POST", {
      file: args.file,
    });
    return convertFileDTO(await this.unwrapResponse<FileDTO>(res));
  }

  async uploadImage(args: UploadImage): Promise<KartenImageFile> {
    const queryParams = args.makeThumbnail ? "?thumb=yes" : "";
    const res = await this.fetchMultipart(
      `/files/image${queryParams}`,
      "POST",
      {
        file: args.file,
      },
    );
    return convertImageFileDTO(await this.unwrapResponse<ImageFileDTO>(res));
  }

  async deleteFile(id: ID) {
    const res = await this.fetchJSON(`/files/${id}`, "DELETE");
    await this.checkResponseError(res);
  }

  /* ------------ */

  async addLabel({ boardId, name, color }: AddLabelArgs): Promise<Label> {
    const res = await this.fetchJSON(`/boards/${boardId}/labels`, "POST", {
      name,
      color: hexColorToNumber(color),
    });
    return convertLabelDTO(await this.unwrapResponse<LabelDTO>(res));
  }

  async deleteLabel(id: number): Promise<void> {
    const res = await this.fetchJSON(`/labels/${id}`, "DELETE");
    await this.checkResponseError(res);
  }

  async editLabel({ labelId, name, color }: EditLabelArgs): Promise<Label> {
    const res = await this.fetchJSON(`/labels/${labelId}`, "PATCH", {
      name,
      color: color && hexColorToNumber(color),
    });
    return convertLabelDTO(await this.unwrapResponse<LabelDTO>(res));
  }
}
