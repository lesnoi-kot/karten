/* Database entities representation*/

export type Color = "red" | "yellow" | "green";

export type UUID = string;
export type ID = string;
export type DateString = string;

export type Comment = {
  id: ID;
  author: string;
  text: string;
  dateCreated: DateString;
};

export type Task = {
  id: ID;
  taskListId: ID;
  name: string;
  text: string;
  position: number;
  dateCreated: DateString;
  dueDate: DateString;
  comments?: ID[];
};

export type TaskList = {
  id: ID;
  boardId: ID;
  archived: boolean;
  position: number;
  name: string;
  dateCreated: DateString;
  color: Color | null;
  tasks?: ID[];
};

export type Board = {
  id: ID;
  projectId: ID;
  archived: boolean;
  name: string;
  dateCreated: DateString;
  dateLastViewed: DateString;
  color: Color | null;
  cover?: string;
  taskLists?: ID[];
};

export type Project = {
  id: ID;
  name: string;
};

export type APIError<T> = {
  code: string;
  message?: string;
  details?: T;
};
