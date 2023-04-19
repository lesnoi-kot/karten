import { ENTITY_COLOR } from "models/constants";
import {
  Board,
  Project,
  TaskList,
  Task,
  Comment,
  KartenFile,
  User,
  KartenImageFile,
} from "models/types";
import {
  ProjectDTO,
  BoardDTO,
  TaskListDTO,
  TaskDTO,
  CommentDTO,
  FileDTO,
  UserDTO,
  ImageFileDTO,
} from "./types";

export function convertProjectDTO(dto: ProjectDTO): Project {
  return {
    id: dto.id,
    name: dto.name,
    avatarURL: dto.avatar_url ?? "",
    avatarThumbnailURL: dto.avatar_thumbnail_url ?? "",
    boards: dto.boards ? dto.boards.map(convertBoardDTO) : [],
  };
}

export function convertBoardDTO(dto: BoardDTO): Board {
  return {
    id: dto.id,
    projectId: dto.project_id,
    archived: dto.archived,
    favorite: dto.favorite,
    name: dto.name,
    dateCreated: dto.date_created,
    dateLastViewed: dto.date_last_viewed,
    color: convertNumberToColor(dto.color),
    coverURL: dto.cover_url ?? "",
    taskLists: dto.task_lists ? dto.task_lists.map(convertTaskListDTO) : [],
  };
}

export function convertTaskListDTO(dto: TaskListDTO): TaskList {
  return {
    id: dto.id,
    boardId: dto.board_id,
    position: dto.position,
    archived: dto.archived,
    name: dto.name,
    dateCreated: dto.date_created,
    color: convertNumberToColor(dto.color),
    tasks: dto.tasks ? dto.tasks.map(convertTaskDTO) : [],
  };
}

export function convertTaskDTO(dto: TaskDTO): Task {
  return {
    id: dto.id,
    taskListId: dto.task_list_id,
    position: dto.position,
    name: dto.name,
    text: dto.text,
    dateCreated: dto.date_created,
    dueDate: dto.due_date,
    comments: dto.comments ? dto.comments.map(convertCommentDTO) : [],
  };
}

export function convertCommentDTO(dto: CommentDTO): Comment {
  return {
    id: dto.id,
    taskId: dto.task_id,
    text: dto.text,
    author: dto.author,
    dateCreated: dto.date_created,
  };
}

function convertNumberToColor(color: number): string {
  return "#" + color.toString(16).padStart(6, "0");
}

export function convertFileDTO(dto: FileDTO): KartenFile {
  return {
    id: dto.id,
    url: dto.url,
    name: dto.name,
    mimeType: dto.mime_type,
    size: dto.size,
  };
}

export function convertImageFileDTO(dto: ImageFileDTO): KartenImageFile {
  return {
    id: dto.id,
    url: dto.url,
    name: dto.name,
    mimeType: dto.mime_type,
    size: dto.size,
    thumbnails: dto.thumbnails?.map(convertFileDTO) ?? [],
  };
}

export function convertFilesDTO(dtos: FileDTO[]): KartenFile[] {
  return dtos.map(convertFileDTO);
}

export function convertUserDTO(dto: UserDTO): User {
  return {
    id: dto.id,
    socialId: dto.social_id,
    name: dto.name,
    login: dto.login,
    email: dto.email,
    url: dto.url,
    avatarURL: dto.avatar_url,
    dateCreated: dto.date_created,
  };
}
