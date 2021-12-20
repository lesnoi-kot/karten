import { is, clone, omit, map } from "ramda";
import { ID, Task, Board, Comment } from "models/types";
import { sleep } from "utils/async";
import { nanoid } from "@reduxjs/toolkit";

import {
  ById,
  AddBoardArgs,
  AddTaskArgs,
  AddCommentArgs,
  AddTaskListArgs,
  API,
  APIError,
  BoardDTO,
  DeleteBoardArgs,
  DeleteTaskArgs,
  DeleteTaskListArgs,
  DeleteTasksArgs,
  EditTaskArgs,
  EditCommentArgs,
  EditTaskListArgs,
  GetTaskListArgs,
  ProjectDTO,
  TaskDTO,
  TaskListDTO,
} from "./types";
import mocks, { MockKey } from "./mocks";

async function emulateDelay(rate: number = 1) {
  await sleep(200 + Math.random() * 500 * rate);
}

const badRequestError = new APIError("400", "bad request");
const notFoundError = new APIError("404", "not found");

export default class MockAPI implements API {
  private mockStorage: ProjectDTO;

  constructor(mockName: MockKey) {
    this.mockStorage = clone(mocks[mockName]);
  }

  private findBoard(id: ID) {
    return this.mockStorage.boards.find((board) => board.id === id);
  }

  private findList(taskListId: ID): [TaskListDTO, BoardDTO] | [null, null] {
    for (const board of this.mockStorage.boards) {
      for (const taskList of board.taskLists || []) {
        if (taskList.id === taskListId) {
          return [taskList, board];
        }
      }
    }

    return [null, null];
  }

  private findTask(taskId: ID) {
    for (const board of this.mockStorage.boards) {
      for (const taskList of board.taskLists || []) {
        for (const task of taskList.tasks) {
          if (task.id === taskId) {
            return task;
          }
        }
      }
    }

    return null;
  }

  private findComment(commentId: ID): [Comment, TaskDTO] | [null, null] {
    for (const board of this.mockStorage.boards) {
      for (const taskList of board.taskLists || []) {
        for (const task of taskList.tasks) {
          for (const comment of task.comments) {
            if (comment.id === commentId) {
              return [comment, task];
            }
          }
        }
      }
    }

    return [null, null];
  }

  async getOverview() {
    const boards = this.mockStorage.boards.map((board) => ({
      id: board.id,
      name: board.name,
      dateLastViewed: board.dateLastViewed,
    }));

    await emulateDelay(5);

    return Promise.resolve({ data: { boards }, error: null });
  }

  async getBoards() {
    await emulateDelay();

    return Promise.resolve({
      data: map(omit(["taskLists"]), this.mockStorage.boards),
      error: null,
    });
  }

  async getBoard({ id }: { id: ID }) {
    await emulateDelay();

    const board = this.mockStorage.boards.find((board) => board.id === id);

    if (!board) {
      return Promise.resolve({ data: null, error: "NOT_FOUND" });
    }

    board.dateLastViewed = new Date().toISOString();

    return Promise.resolve({ data: board, error: null });
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

    return Promise.resolve({
      data: clone(board),
      error: null,
    });
  }

  async addTask(arg: AddTaskArgs) {
    await emulateDelay(1.5);

    const [list] = this.findList(arg.taskListId);

    if (!list) {
      throw notFoundError;
    }

    const task: TaskDTO = {
      ...arg.task,
      id: Date.now().toString(),
      taskListId: arg.taskListId,
      position: Date.now(),
      dateCreated: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      text: "",
      comments: [],
    };

    list.tasks.push(task);

    return Promise.resolve({
      data: omit(["comments"], clone(task)),
      error: null,
    });
  }

  async deleteTask(arg: DeleteTaskArgs) {
    await emulateDelay();

    const task = this.findTask(arg.taskId);

    if (!task) {
      throw notFoundError;
    }

    const [list] = this.findList(task.taskListId);

    if (!list) {
      throw notFoundError;
    }

    const idx = list.tasks.findIndex((task) => task.id === arg.taskId);

    if (idx < 0) {
      throw notFoundError;
    }

    list.tasks.splice(idx, 1);

    return Promise.resolve({
      data: null,
      error: null,
    });
  }

  async deleteTasks(arg: DeleteTasksArgs) {
    await emulateDelay();

    const [list] = this.findList(arg.taskListId);

    if (!list) {
      throw notFoundError;
    }

    list.tasks = list.tasks.filter((task) => !arg.taskIds.includes(task.id));

    return Promise.resolve({
      data: null,
      error: null,
    });
  }

  async getTaskList({ boardId, taskListId }: GetTaskListArgs) {
    const [taskList] = this.findList(taskListId);

    await emulateDelay();

    if (!taskList) {
      throw notFoundError;
    }

    return Promise.resolve({
      data: clone(taskList),
      error: null,
    });
  }

  async addBoard({ name }: AddBoardArgs) {
    await emulateDelay(5);

    const newBoard = {
      id: Date.now().toString(),
      projectId: "sadPoe",
      name,
      archived: false,
      dateCreated: new Date().toISOString(),
      dateLastViewed: new Date().toISOString(),
      color: null,
      taskLists: [],
    };

    this.mockStorage.boards.push(newBoard);

    return Promise.resolve({
      data: clone(newBoard),
      error: null,
    });
  }

  async addTaskList({ boardId, name }: AddTaskListArgs) {
    await emulateDelay(1.5);

    const board = this.findBoard(boardId);

    if (!board) {
      throw notFoundError;
    }

    const newTaskList = {
      id: nanoid(),
      boardId,
      name,
      position: Date.now(),
      archived: false,
      dateCreated: new Date().toISOString(),
      color: null,
      tasks: [],
    };

    board.taskLists?.push(newTaskList);

    return Promise.resolve({
      data: clone(newTaskList),
      error: null,
    });
  }

  async deleteTaskList(arg: DeleteTaskListArgs) {
    await emulateDelay();

    const [taskList, board] = this.findList(arg.taskListId);

    if (!taskList || !board) {
      throw notFoundError;
    }

    const idx = board.taskLists?.findIndex((t) => t.id === taskList.id) ?? -1;

    if (idx >= 0) {
      board.taskLists?.splice(idx, 1);
    }

    return Promise.resolve({
      data: null,
      error: null,
    });
  }

  async editTaskList(arg: EditTaskListArgs) {
    await emulateDelay();

    const [taskList, board] = this.findList(arg.taskListId);

    if (!taskList || !board) {
      throw notFoundError;
    }

    if (arg.name) {
      taskList.name = arg.name;
    }

    return Promise.resolve({
      data: null,
      error: null,
    });
  }

  async editTask(arg: EditTaskArgs) {
    await emulateDelay();

    const task = this.findTask(arg.taskId);

    if (!task) {
      throw notFoundError;
    }

    if (arg.name) {
      task.name = arg.name;
    }

    if (arg.text) {
      task.text = arg.text;
    }

    return Promise.resolve({
      data: omit(["comments"], task),
      error: null,
    });
  }

  async deleteBoard(arg: DeleteBoardArgs) {
    await emulateDelay();
    const idx = this.mockStorage.boards.findIndex(
      (board) => board.id === arg.boardId
    );

    if (idx < 0) {
      throw notFoundError;
    }

    this.mockStorage.boards.splice(idx, 1);

    return Promise.resolve({
      data: null,
      error: null,
    });
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

    return {
      data: comment,
      error: null,
    };
  }

  async deleteComment(arg: ById) {
    await emulateDelay(1.5);

    const [comment, task] = this.findComment(arg.id);

    if (!task || !comment) {
      throw notFoundError;
    }

    task.comments.splice(task.comments.indexOf(comment), 1);

    return {
      data: null,
      error: null,
    };
  }

  async editComment(arg: EditCommentArgs) {
    await emulateDelay(1.5);

    const [comment, task] = this.findComment(arg.commentId);

    if (!task || !comment) {
      throw notFoundError;
    }

    if (arg.text) {
      comment.text = arg.text;
    }

    return {
      data: comment,
      error: null,
    };
  }
}
