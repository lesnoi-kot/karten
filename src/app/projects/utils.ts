import { forEachObjIndexed } from "ramda";
import { schema, normalize } from "normalizr";
import { Project } from "models/types";

import { boardsScheme } from "../boards/utils";

const projectScheme = new schema.Entity("projects", {
  boards: boardsScheme,
});

const projectsScheme = [projectScheme];

function stripBoards(project: Project) {
  delete project.boards;
}

export function normalizeProjects(data: any) {
  const normalized = normalize(data, projectsScheme);
  forEachObjIndexed(stripBoards, normalized.entities.projects);

  return {
    projects: normalized.entities.projects ?? {},
    boards: normalized.entities.boards ?? {},
  };
}

export function normalizeProject(data: any) {
  const normalized = normalize(data, projectScheme);
  forEachObjIndexed(stripBoards, normalized.entities.projects);

  return {
    projects: normalized.entities.projects ?? {},
    boards: normalized.entities.boards ?? {},
  };
}
