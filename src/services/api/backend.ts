import { ID, Project, Board, TaskList, Task, Comment } from "models/types";

import {
  convertProjectDTO,
  convertBoardDTO,
  convertTaskListDTO,
  convertTaskDTO,
  convertCommentDTO,
} from "./dtoToModel";
import {
  AddBoardArgs,
  AddCommentArgs,
  AddProjectArgs,
  AddTaskArgs,
  AddTaskListArgs,
  API,
  APIError,
  BoardDTO,
  CommentDTO,
  EditBoardArgs,
  EditCommentArgs,
  EditProjectArgs,
  EditTaskArgs,
  EditTaskListArgs,
  ProjectDTO,
  ResponseError,
  ResponseOK,
  TaskDTO,
  TaskListDTO,
} from "./types";

export class APIService implements API {
  apiRootURL: string;

  constructor(apiRootURL: string) {
    if (apiRootURL.endsWith("/")) {
      apiRootURL = apiRootURL.substring(0, apiRootURL.length - 1);
    }
    this.apiRootURL = apiRootURL;
  }

  private async unwrapResponse<T>(response: globalThis.Response): Promise<T> {
    await this.checkResponseError(response);
    const body = (await response.json()) as ResponseOK<T>;
    return body.data;
  }

  private async checkResponseError(response: globalThis.Response) {
    if (response.status < 200 || response.status >= 300) {
      const body = (await response.json()) as ResponseError<any>;
      throw new APIError(body.error);
    }
  }

  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${this.apiRootURL}/projects`);
    const dtos = await this.unwrapResponse<ProjectDTO[]>(res);
    return dtos.map(convertProjectDTO);
  }

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`${this.apiRootURL}/projects/${id}`);
    return convertProjectDTO(await this.unwrapResponse<ProjectDTO>(res));
  }

  async editProject(args: EditProjectArgs): Promise<Project> {
    const res = await fetch(`${this.apiRootURL}/projects/${args.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: args.name }),
    });
    return convertProjectDTO(await this.unwrapResponse<ProjectDTO>(res));
  }

  async addProject(args: AddProjectArgs): Promise<Project> {
    const res = await fetch(`${this.apiRootURL}/projects`, {
      method: "POST",
      body: JSON.stringify(args),
    });
    return convertProjectDTO(await this.unwrapResponse<ProjectDTO>(res));
  }

  async deleteProject(id: string) {
    const res = await fetch(`${this.apiRootURL}/projects/${id}`, {
      method: "DELETE",
    });
    await this.checkResponseError(res);
  }

  /* ------------ */

  async getBoard(id: string): Promise<Board> {
    const res = await fetch(`${this.apiRootURL}/boards/${id}`);
    return convertBoardDTO(await this.unwrapResponse<BoardDTO>(res));
  }

  async editBoard(args: EditBoardArgs): Promise<Board> {
    const res = await fetch(`${this.apiRootURL}/projects/${args.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: args.name }),
    });
    return convertBoardDTO(await this.unwrapResponse<BoardDTO>(res));
  }

  async deleteBoard(id: string): Promise<void> {
    const res = await fetch(`${this.apiRootURL}/boards/${id}`, {
      method: "DELETE",
    });
    await this.checkResponseError(res);
  }

  async addBoard(args: AddBoardArgs): Promise<Board> {
    const { projectId, name } = args;

    const res = await fetch(`${this.apiRootURL}/projects/${projectId}/boards`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    return convertBoardDTO(await this.unwrapResponse<BoardDTO>(res));
  }

  /* ------------ */

  async getTaskList(id: string): Promise<TaskList> {
    const res = await fetch(`${this.apiRootURL}/task-lists/${id}`);
    return convertTaskListDTO(await this.unwrapResponse<TaskListDTO>(res));
  }

  async editTaskList(args: EditTaskListArgs): Promise<TaskList> {
    const res = await fetch(`${this.apiRootURL}/task-lists/${args.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: args.name, position: args.position }),
    });

    return convertTaskListDTO(await this.unwrapResponse<TaskListDTO>(res));
  }

  async deleteTaskList(id: string) {
    const res = await fetch(`${this.apiRootURL}/task-lists/${id}`, {
      method: "DELETE",
    });
    await this.checkResponseError(res);
  }

  async addTaskList(args: AddTaskListArgs): Promise<TaskList> {
    const res = await fetch(
      `${this.apiRootURL}/boards/${args.boardId}/task-lists`,
      {
        method: "POST",
        body: JSON.stringify({ name: args.name }),
      },
    );
    return convertTaskListDTO(await this.unwrapResponse<TaskListDTO>(res));
  }

  /* ------------ */

  async getTask(id: string): Promise<Task> {
    const res = await fetch(`${this.apiRootURL}/tasks/${id}`);
    return convertTaskDTO(await this.unwrapResponse<TaskDTO>(res));
  }

  async editTask(args: EditTaskArgs): Promise<Task> {
    const res = await fetch(`${this.apiRootURL}/tasks/${args.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: args.name,
        position: args.position,
        text: args.text,
        due_date: args.due_date,
      }),
    });

    return convertTaskDTO(await this.unwrapResponse<TaskDTO>(res));
  }

  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`${this.apiRootURL}/tasks/${id}`, {
      method: "DELETE",
    });
    await this.checkResponseError(res);
  }

  async deleteTasks(args: ID[]): Promise<void> {
    // TODO
  }

  async addTask(args: AddTaskArgs): Promise<Task> {
    const res = await fetch(
      `${this.apiRootURL}/task-lists/${args.taskListId}/tasks`,
      {
        method: "POST",
        body: JSON.stringify({ name: args.name }),
      },
    );
    return convertTaskDTO(await this.unwrapResponse<TaskDTO>(res));
  }

  /* ------------ */

  async addComment(args: AddCommentArgs): Promise<Comment> {
    const res = await fetch(
      `${this.apiRootURL}/tasks/${args.taskId}/comments`,
      {
        method: "POST",
        body: JSON.stringify({ text: args.text }),
      },
    );
    return convertCommentDTO(await this.unwrapResponse<CommentDTO>(res));
  }

  async editComment(args: EditCommentArgs): Promise<Comment> {
    const res = await fetch(`${this.apiRootURL}/comments/${args.id}`, {
      method: "PATCH",
      body: JSON.stringify({ text: args.text }),
    });

    return convertCommentDTO(await this.unwrapResponse<CommentDTO>(res));
  }

  async deleteComment(id: string): Promise<void> {
    const res = await fetch(`${this.apiRootURL}/comments/${id}`, {
      method: "DELETE",
    });
    await this.checkResponseError(res);
  }
}
