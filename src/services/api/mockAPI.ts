import { is, clone } from "ramda";
import { nanoid } from "@reduxjs/toolkit";

import { ID, Task, Board, Comment, Project, TaskList } from "models/types";
import { sleep } from "utils/async";

import {
  AddBoardArgs,
  AddTaskArgs,
  AddCommentArgs,
  AddTaskListArgs,
  AddProjectArgs,
  API,
  APIError,
  EditTaskArgs,
  EditCommentArgs,
  EditTaskListArgs,
  EditProjectArgs,
} from "./types";

async function emulateDelay(rate: number = 1) {
  await sleep(200 + Math.random() * 500 * rate);
}

const badRequestError = new APIError("400", "bad request");
const notFoundError = new APIError("404", "not found");

export type MockStorage = {
  projects: Record<ID, Project>;
  boards: Record<ID, Board>;
  taskLists: Record<ID, TaskList>;
  tasks: Record<ID, Task>;
  comments: Record<ID, Comment>;
};

export default class MockAPI implements API {
  private mockStorage: MockStorage;

  constructor(mock: MockStorage) {
    this.mockStorage = clone(mock);
  }

  private findBoard(id: ID): Board | null {
    return this.mockStorage.boards[id] ?? null;
  }

  private findList(id: ID): TaskList | null {
    return this.mockStorage.taskLists[id] ?? null;
  }

  private findTask(id: ID): Task | null {
    return this.mockStorage.tasks[id] ?? null;
  }

  private findComment(id: ID): Comment | null {
    return this.mockStorage.comments[id] ?? null;
  }

  async getProjects(): Promise<Project[]> {
    return Object.values(this.mockStorage.projects);
  }

  async getProject(id: ID): Promise<Project> {
    await emulateDelay(1);
    const project = this.mockStorage.projects[id];

    if (!project) {
      throw notFoundError;
    }

    return project;
  }

  async addProject(args: AddProjectArgs): Promise<Project> {
    await emulateDelay(1.5);

    const project: Project = {
      id: Date.now().toString(),
      name: args.name,
      boards: [],
    };

    this.mockStorage.projects[project.id] = project;
    return clone(project);
  }

  async editProject(args: EditProjectArgs): Promise<Project> {
    await emulateDelay(1);
    const project = await this.getProject(args.id);
    project.name = args.name;
    return clone(project);
  }

  async deleteProject(id: ID): Promise<void> {
    await emulateDelay(1);

    if (await this.getProject(id)) {
      delete this.mockStorage.projects[id];
    }
  }

  async getBoards() {
    await emulateDelay();
    return Object.values(this.mockStorage.boards);
  }

  async getBoard(id: ID) {
    await emulateDelay();

    const board = this.findBoard(id);

    if (!board) {
      throw notFoundError;
    }

    board.dateLastViewed = new Date().toISOString();

    return board;
  }

  async editBoard(boardChanges: Partial<Board>) {
    if (!is(String, boardChanges.id)) {
      throw badRequestError;
    }

    const board = this.findBoard(boardChanges.id!);

    if (!board) {
      throw notFoundError;
    }

    Object.assign(board, boardChanges);

    return clone(board);
  }

  async addTask(arg: AddTaskArgs) {
    await emulateDelay(1.5);

    const list = this.findList(arg.taskListId);

    if (!list) {
      throw notFoundError;
    }

    const task: Task = {
      id: Date.now().toString(),
      name: arg.name,
      taskListId: arg.taskListId,
      position: Date.now(),
      dateCreated: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      text: "",
      comments: [],
    };

    return clone(task);
  }

  async deleteTask(taskId: ID) {
    await emulateDelay();

    const task = this.findTask(taskId);

    if (!task) {
      throw notFoundError;
    }

    delete this.mockStorage.tasks[taskId];
  }

  async deleteTasks(taskIds: ID[]) {
    await emulateDelay();

    taskIds.forEach((id) => {
      delete this.mockStorage.tasks[id];
    });
  }

  async getTaskList(taskListId: ID) {
    const taskList = this.findList(taskListId);

    await emulateDelay();

    if (!taskList) {
      throw notFoundError;
    }

    return clone(taskList);
  }

  async addBoard({ name }: AddBoardArgs) {
    await emulateDelay(5);

    const newBoard: Board = {
      id: Date.now().toString(),
      projectId: "sadPoe",
      name,
      archived: false,
      dateCreated: new Date().toISOString(),
      dateLastViewed: new Date().toISOString(),
      color: 0,
      cover: "",
      taskLists: [],
    };

    this.mockStorage.boards[newBoard.id] = newBoard;
    return clone(newBoard);
  }

  async addTaskList({ boardId, name }: AddTaskListArgs) {
    await emulateDelay(1.5);

    const board = this.findBoard(boardId);

    if (!board) {
      throw notFoundError;
    }

    const newTaskList: TaskList = {
      id: nanoid(),
      boardId,
      name,
      position: Date.now(),
      archived: false,
      dateCreated: new Date().toISOString(),
      color: 0,
      tasks: [],
    };

    this.mockStorage.taskLists[newTaskList.id] = newTaskList;
    return clone(newTaskList);
  }

  async deleteTaskList(id: ID) {
    await emulateDelay();

    const taskList = this.findList(id);

    if (!taskList) {
      throw notFoundError;
    }

    delete this.mockStorage.taskLists[id];
  }

  async editTaskList(arg: EditTaskListArgs) {
    await emulateDelay();

    const taskList = this.findList(arg.id);

    if (!taskList) {
      throw notFoundError;
    }

    if (arg.name) {
      taskList.name = arg.name;
    }
    if (arg.position) {
      taskList.position = arg.position;
    }

    return taskList;
  }

  async getTask(id: ID): Promise<Task> {
    await emulateDelay(1);
    const task = this.mockStorage.tasks[id];

    if (!task) {
      throw notFoundError;
    }

    return task;
  }

  async editTask(arg: EditTaskArgs) {
    await emulateDelay();

    const task = this.findTask(arg.id);

    if (!task) {
      throw notFoundError;
    }

    if (arg.name) {
      task.name = arg.name;
    }
    if (arg.text) {
      task.text = arg.text;
    }
    if (arg.position) {
      task.position = arg.position;
    }
    if (arg.taskListId) {
      task.taskListId = arg.taskListId;
    }

    return task;
  }

  async deleteBoard(id: ID) {
    await emulateDelay();
    const board = this.findBoard(id);

    if (!board) {
      throw notFoundError;
    }

    delete this.mockStorage.boards[id];
  }

  async addComment(arg: AddCommentArgs) {
    await emulateDelay(2);

    const task = this.findTask(arg.taskId);

    if (!task) {
      throw notFoundError;
    }

    const comment: Comment = {
      id: nanoid(),
      taskId: task.id,
      author: "Yuko",
      text: arg.text ?? "",
      dateCreated: new Date().toISOString(),
    };

    return comment;
  }

  async deleteComment(id: ID) {
    await emulateDelay(1.5);

    const comment = this.findComment(id);

    if (!comment) {
      throw notFoundError;
    }

    delete this.mockStorage.comments[id];
  }

  async editComment(arg: EditCommentArgs) {
    await emulateDelay(1.5);

    const comment = this.findComment(arg.id);

    if (!comment) {
      throw notFoundError;
    }

    if (arg.text) {
      comment.text = arg.text;
    }

    return comment;
  }
}
