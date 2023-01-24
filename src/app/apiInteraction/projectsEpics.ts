import { of, from } from "rxjs";
import { filter, switchMap, mergeMap, catchError } from "rxjs/operators";

import { boardsSet } from "app/boards";
import { projectsSet, projectSet, projectDeleted } from "app/projects";
import { normalizeProjects, normalizeProject } from "app/projects/utils";
import { showSnackbar } from "app/snackbars";

import { Epic } from "../types";
import { actions } from "./slice";
import { selectProjectById } from "app/projects/selectors";

export const getProjectsEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.getProjects.match),
    switchMap(({ meta: { requestKey, signal } }) =>
      from(api.getProjects()).pipe(
        mergeMap((projectsArr) => {
          const { projects, boards } = normalizeProjects(projectsArr);

          return of(
            projectsSet(projects),
            boardsSet(boards),
            actions.requestLoaded(requestKey),
          );
        }),
        catchError((error) =>
          of(
            actions.requestFailed(error, requestKey),
            showSnackbar({ message: String(error), type: "error" }),
          ),
        ),
      ),
    ),
  );

export const getProjectEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.getProject.match),
    switchMap(({ payload: projectId, meta: { requestKey } }) =>
      from(api.getProject(projectId)).pipe(
        mergeMap((project) => {
          const { boards, projects } = normalizeProject(project);
          return of(
            projectsSet(projects),
            boardsSet(boards),
            actions.requestLoaded(requestKey),
          );
        }),
        catchError((error) => of(actions.requestFailed(error, requestKey))),
      ),
    ),
  );

export const addProjectEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.addProject.match),
    switchMap(({ payload, meta: { requestKey } }) =>
      from(api.addProject(payload)).pipe(
        mergeMap((project) => {
          return of(
            projectSet(project),
            actions.requestLoaded(requestKey),
            showSnackbar({
              message: `Project "${payload.name}" is created!`,
              type: "success",
            }),
          );
        }),
        catchError((error) =>
          of(
            actions.requestFailed(error, requestKey),
            showSnackbar({ message: error, type: "error" }),
          ),
        ),
      ),
    ),
  );

export const updateProjectEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.updateProject.match),
    switchMap(({ payload, meta: { requestKey } }) =>
      from(api.editProject(payload)).pipe(
        mergeMap((project) => {
          const { boards, projects } = normalizeProject(project);

          return of(
            projectsSet(projects),
            boardsSet(boards),

            actions.requestLoaded(requestKey),
          );
        }),
        catchError((error) =>
          of(
            actions.requestFailed(error, requestKey),
            showSnackbar({ message: error, type: "error" }),
          ),
        ),
      ),
    ),
  );

export const deleteProjectEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.deleteProject.match),
    switchMap(({ payload: projectId, meta: { requestKey } }) =>
      from(api.deleteProject(projectId)).pipe(
        mergeMap(() => {
          const project = selectProjectById(store$.value, projectId);

          return of(
            projectDeleted(projectId),
            actions.requestLoaded(requestKey),
            showSnackbar({
              message: `Project "${project?.name}" was deleted!`,
              type: "info",
            }),
          );
        }),
        catchError((error) =>
          of(
            actions.requestFailed(error, requestKey),
            showSnackbar({ message: error, type: "error" }),
          ),
        ),
      ),
    ),
  );
