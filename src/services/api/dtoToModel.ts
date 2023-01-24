import { ENTITY_COLOR } from "models/constants";
import { Board, Project, TaskList, Task, Comment } from "models/types";
import {
  ProjectDTO,
  BoardDTO,
  TaskListDTO,
  TaskDTO,
  CommentDTO,
} from "./types";

export function convertProjectDTO(dto: ProjectDTO): Project {
  return {
    id: dto.id,
    name: dto.name,
    boards: dto.boards ? dto.boards.map(convertBoardDTO) : [],
  };
}

export function convertBoardDTO(dto: BoardDTO): Board {
  return {
    id: dto.id,
    projectId: dto.project_id,
    archived: dto.archived,
    name: dto.name,
    dateCreated: dto.date_created,
    dateLastViewed: dto.date_last_viewed,
    color: convertNumberToColor(dto.color),
    cover: dto.cover ?? "",
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
  if (!color) {
    return ENTITY_COLOR.gray;
  }

  return "#" + color.toString(16).padEnd(6, "0");
}
