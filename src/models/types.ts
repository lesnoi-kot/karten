import { immerable } from "immer";

import { ENTITY_COLOR } from "./constants";

export type UUID = string;
export type Color = string;
export type ID = UUID;
export type UserID = number;
export type DateString = string;
export type ColorName = keyof typeof ENTITY_COLOR;

export type Comment = {
  id: UUID;
  taskId: UUID;
  userId: UserID;
  author: {
    id: UUID;
    name: string;
    avatarURL: string;
    dateCreated: Date;
  } | null;
  text: string;
  html: string;
  dateCreated: Date;
  attachments: KartenFile[];
};

export class Task {
  [immerable] = true;

  constructor(
    public id: UUID,
    public taskListId: UUID,
    public userId: UserID,
    public name: string,
    public text: string,
    public html: string,
    public position: number,
    public dateCreated: DateString,
    public dateStartedTracking: Date | null,
    public spentTime: number,
    public dueDate: DateString | null,
    public comments: Comment[],
    public attachments: KartenFile[],
    public labels: Label[],
  ) {}

  getComment(commentId: ID) {
    return this.comments.find((comment) => comment.id === commentId);
  }

  deleteComment(commentId: ID) {
    const idx = this.comments.findIndex((comment) => comment.id === commentId);

    if (idx !== -1) {
      this.comments.splice(idx, 1);
    }
  }
}

export class TaskList {
  [immerable] = true;

  constructor(
    public id: UUID,
    public boardId: UUID,
    public userId: UserID,
    public archived: boolean,
    public position: number,
    public name: string,
    public dateCreated: DateString,
    public color: Color,
    public tasks: Task[],
  ) {
    this.sortTasks();
  }

  setName(name: string) {
    this.name = name;
  }

  sortTasks() {
    this.tasks.sort((a, b) => a.position - b.position);
  }

  clear() {
    this.tasks.length = 0;
  }

  getTask(taskId: ID) {
    return this.tasks.find((task) => task.id === taskId) || null;
  }

  addTask(task: Task) {
    task.taskListId = this.id;
    this.tasks.push(task);
    this.sortTasks();
  }

  unshiftTask(task: Task) {
    if (this.tasks.length > 0) {
      task.position = this.tasks[0].position - 1000;
    } else {
      task.position = 1000;
    }

    task.taskListId = this.id;
    this.tasks.unshift(task);
  }

  pushTask(task: Task) {
    if (this.tasks.length > 0) {
      task.position = this.tasks[this.tasks.length - 1].position + 1000;
    } else {
      task.position = 1000;
    }

    task.taskListId = this.id;
    this.tasks.push(task);
  }

  indexOfTask(taskId: ID) {
    return this.tasks.findIndex((task) => task.id === taskId);
  }

  deleteTask(taskId: ID) {
    const idx = this.tasks.findIndex((task) => task.id === taskId);

    if (idx !== -1) {
      this.tasks[idx].taskListId = "";
      this.tasks.splice(idx, 1);
    }
  }
}

type MoveTaskArgs =
  | { taskId: ID; targetId: ID; isBefore: boolean }
  | { taskId: ID; targetTaskListId: ID; isBefore: boolean };

type MoveTaskListArgs = {
  taskListId: ID;
  targetTaskListId: ID;
  isBefore: boolean;
};

export class Board {
  [immerable] = true;

  constructor(
    public id: UUID,
    public projectId: UUID,
    public userId: UserID,
    public archived: boolean,
    public favorite: boolean,
    public name: string,
    public dateCreated: DateString,
    public dateLastViewed: DateString,
    public color: Color,
    public coverURL: string,
    public taskLists: TaskList[],
    public projectName: string,
    public labels: Label[],
  ) {
    this.sortTaskLists();
  }

  addTaskList(taskList: TaskList) {
    taskList.boardId = this.id;
    this.taskLists.push(taskList);
    this.sortTaskLists();
  }

  sortTaskLists() {
    this.taskLists.sort((a, b) => a.position - b.position);
  }

  getTaskList(taskListId: ID) {
    return (
      this.taskLists.find((taskList) => taskList.id === taskListId) || null
    );
  }

  getTask(taskId: ID) {
    for (const taskList of this.taskLists) {
      const task = taskList.getTask(taskId);

      if (task) {
        return task;
      }
    }

    return null;
  }

  deleteTaskList(taskListId: ID) {
    const idx = this.taskLists.findIndex(
      (taskList) => taskList.id === taskListId,
    );

    if (idx !== -1) {
      this.taskLists.splice(idx, 1);
    }
  }

  deleteTask(taskId: ID) {
    this.taskLists.forEach((taskList) => {
      taskList.deleteTask(taskId);
    });
  }

  moveTask(args: MoveTaskArgs) {
    const { taskId, isBefore } = args;
    const task = this.getTask(taskId);
    if (!task) {
      return;
    }

    const taskList = this.getTaskList(task.taskListId);

    if ("targetTaskListId" in args) {
      const targetTaskList = this.getTaskList(args.targetTaskListId);

      if (targetTaskList?.getTask(taskId)) {
        return;
      }

      taskList?.deleteTask(task.id);
      if (isBefore) {
        targetTaskList?.unshiftTask(task);
      } else {
        targetTaskList?.pushTask(task);
      }

      return;
    }

    const targetTask = this.getTask(args.targetId);
    if (!targetTask) {
      return;
    }

    const targetTaskList = this.getTaskList(targetTask.taskListId);
    if (!targetTaskList || !taskList) {
      return;
    }

    const targetTaskIndex = targetTaskList.indexOfTask(args.targetId);

    if (targetTaskIndex === targetTaskList.tasks.length - 1 && !isBefore) {
      task.position = targetTask.position + 1000;
    } else if (targetTaskIndex === 0 && isBefore) {
      task.position = targetTask.position - 1000;
    } else {
      const nextOrPrevDropTask =
        targetTaskList.tasks[targetTaskIndex + (isBefore ? -1 : 1)];
      const newPosition = Math.floor(
        (targetTask.position + nextOrPrevDropTask.position) / 2,
      );

      task.position = newPosition;
    }

    taskList.deleteTask(task.id);
    targetTaskList.addTask(task);
  }

  moveTaskList({ taskListId, targetTaskListId, isBefore }: MoveTaskListArgs) {
    const taskList = this.getTaskList(taskListId);
    const targetTaskList = this.getTaskList(targetTaskListId);

    if (!taskList || !targetTaskList) {
      return;
    }

    const targetIndex = this.taskLists.indexOf(targetTaskList);

    if (targetIndex === 0) {
      taskList.position = targetTaskList.position - 1000;
    } else if (targetIndex === this.taskLists.length - 1) {
      taskList.position = targetTaskList.position + 1000;
    } else {
      const nextOrPrev = this.taskLists[targetIndex + (isBefore ? -1 : 1)];
      const newPosition = Math.floor(
        (targetTaskList.position + nextOrPrev.position) / 2,
      );
      taskList.position = newPosition;
    }

    this.sortTaskLists();
  }
}

export type Project = {
  id: UUID;
  userId: UserID;
  name: string;
  avatarURL: string;
  avatarThumbnailURL: string;
  boards: Board[];
};

export type KartenFile = {
  id: string;
  url: string;
  name: string;
  mimeType: string;
  size: number;
};

export type KartenImageFile = KartenFile & {
  thumbnails: KartenFile[];
};

export type User = {
  id: number;
  socialId: string;
  name: string;
  login: string;
  email: string;
  url: string;
  avatarURL: string;
  dateCreated: string;
};

export type Label = {
  id: number;
  boardId: string;
  userId: UserID;
  name: string;
  color: string;
};
