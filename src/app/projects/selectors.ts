import { createSelector } from "reselect";

import { RootState } from "app/types";
import { ID, Project } from "models/types";

export const selectProjects = (state: RootState) =>
  state.entities.projects.items;

export const selectProjectsIds = createSelector(selectProjects, Object.keys);

export const selectProjectById = (
  state: RootState,
  projectId: ID,
): Project | null => state.entities.projects.items[projectId] ?? null;
