import { ENTITY_COLOR } from "./constants";

export type UUID = string;
export type Color = string;
export type ID = UUID;
export type DateString = string;
export type ColorName = keyof typeof ENTITY_COLOR;

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
  favorite: boolean;
  name: string;
  dateCreated: DateString;
  dateLastViewed: DateString;
  color: Color;
  coverURL: string;
  taskLists?: TaskList[];
};

export type Project = {
  id: UUID;
  name: string;
  avatarURL: string;
  avatarThumbnailURL: string;
  boards?: Board[];
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
