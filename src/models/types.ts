export type UUID = string;
export type Color = number;
export type ID = UUID;
export type DateString = string;

export type Comment = {
  id: UUID;
  taskId: UUID;
  author: string;
  text: string;
  dateCreated: DateString;
};

export type Task = {
  id: UUID;
  taskListId: UUID;
  name: string;
  text: string;
  position: number;
  dateCreated: DateString;
  dueDate: DateString;
  comments?: Comment[];
};

export type TaskList = {
  id: UUID;
  boardId: UUID;
  archived: boolean;
  position: number;
  name: string;
  dateCreated: DateString;
  color: Color;
  tasks?: Task[];
};

export type Board = {
  id: UUID;
  projectId: UUID;
  archived: boolean;
  name: string;
  dateCreated: DateString;
  dateLastViewed: DateString;
  color: Color;
  cover: string;
  taskLists?: TaskList[];
};

export type Project = {
  id: UUID;
  name: string;
  boards?: Board[];
};
