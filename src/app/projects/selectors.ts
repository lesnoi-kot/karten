import { createSelector } from "reselect";

import { RootState } from "app/types";
import { ID, Project } from "models/types";

import { ProjectsMap } from "./slice";

const selectProjectsMap = (state: RootState): ProjectsMap =>
  state.entities.projects.items;

export const selectProjects = (state: RootState) =>
  Object.values(selectProjectsMap(state));

export const selectProjectsIds = createSelector(selectProjectsMap, Object.keys);

export const selectProjectById = (
  state: RootState,
  projectId: ID,
): Project | null => state.entities.projects.items[projectId] ?? null;
