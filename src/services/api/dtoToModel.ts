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
  return new Board(
    dto.id,
    dto.project_id,
    dto.archived,
    dto.favorite,
    dto.name,
    dto.date_created,
    dto.date_last_viewed,
    convertNumberToColor(dto.color),
    dto.cover_url ?? "",
    dto.task_lists ? dto.task_lists.map(convertTaskListDTO) : [],
    dto.project_name,
  );
}

export function convertTaskListDTO(dto: TaskListDTO): TaskList {
  return new TaskList(
    dto.id,
    dto.board_id,
    dto.archived,
    dto.position,
    dto.name,
    dto.date_created,
    convertNumberToColor(dto.color),
    dto.tasks ? dto.tasks.map(convertTaskDTO) : [],
  );
}

export function convertTaskDTO(dto: TaskDTO): Task {
  return {
    id: dto.id,
    taskListId: dto.task_list_id,
    position: dto.position,
    name: dto.name,
    text: dto.text,
    html: dto.html,
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
