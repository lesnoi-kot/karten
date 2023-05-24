import {
  Board,
  Project,
  TaskList,
  Task,
  Comment,
  KartenFile,
  User,
  KartenImageFile,
  Label,
} from "models/types";
import { numberToHexColor } from "utils/color";

import {
  ProjectDTO,
  BoardDTO,
  TaskListDTO,
  TaskDTO,
  CommentDTO,
  FileDTO,
  UserDTO,
  ImageFileDTO,
  LabelDTO,
} from "./types";

export function convertProjectDTO(dto: ProjectDTO): Project {
  return {
    id: dto.id,
    userId: dto.user_id,
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
    dto.user_id,
    dto.archived,
    dto.favorite,
    dto.name,
    dto.date_created,
    dto.date_last_viewed,
    numberToHexColor(dto.color),
    dto.cover_url ?? "",
    dto.task_lists ? dto.task_lists.map(convertTaskListDTO) : [],
    dto.project_name,
    dto.labels ? dto.labels.map(convertLabelDTO) : [],
  );
}

export function convertTaskListDTO(dto: TaskListDTO): TaskList {
  return new TaskList(
    dto.id,
    dto.board_id,
    dto.user_id,
    dto.archived,
    dto.position,
    dto.name,
    dto.date_created,
    numberToHexColor(dto.color),
    dto.tasks ? dto.tasks.map(convertTaskDTO) : [],
  );
}

export function convertLabelDTO(dto: LabelDTO): Label {
  return {
    id: dto.id,
    boardId: dto.board_id,
    userId: dto.user_id,
    name: dto.name,
    color: numberToHexColor(dto.color),
  };
}

export function convertTaskDTO(dto: TaskDTO): Task {
  return new Task(
    dto.id,
    dto.task_list_id,
    dto.user_id,
    dto.name,
    dto.text,
    dto.html,
    dto.position,
    dto.date_created,
    dto.date_started_tracking ? new Date(dto.date_started_tracking) : null,
    dto.spent_time,
    dto.due_date,
    dto.comments ? dto.comments.map(convertCommentDTO) : [],
    dto.attachments ? dto.attachments.map(convertFileDTO) : [],
    dto.labels ? dto.labels.map(convertLabelDTO) : [],
  );
}

export function convertCommentDTO(dto: CommentDTO): Comment {
  return {
    id: dto.id,
    taskId: dto.task_id,
    userId: dto.user_id,
    text: dto.text,
    html: dto.html,
    author: dto.author
      ? {
          id: dto.author.id,
          name: dto.author.name,
          avatarURL: dto.author.avatar_url,
          dateCreated: new Date(dto.author.date_created),
        }
      : null,
    dateCreated: new Date(dto.date_created),
    attachments: dto.attachments ? dto.attachments.map(convertFileDTO) : [],
  };
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
