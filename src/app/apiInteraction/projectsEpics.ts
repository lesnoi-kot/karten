import { of, from } from "rxjs";
import { filter, switchMap, mergeMap, catchError } from "rxjs/operators";

import { boardsSet } from "app/boards";
import {
  projectsSet,
  projectSet,
  projectDeleted,
  projectCleared,
  allProjectsDeleted,
} from "app/projects";
import { normalizeProjects, normalizeProject } from "app/projects/utils";
import { showSnackbar } from "app/snackbars";

import { Epic } from "../types";
import { actions } from "./slice";
import { selectProjectById } from "app/projects/selectors";

export const getProjectsEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.getProjects.match),
    switchMap(({ payload, meta: { requestKey } }) =>
      from(api.getProjects(payload)).pipe(
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
              message: `Project "${payload.name}" has been created`,
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
              message: `Project "${project?.name}" has been deleted!`,
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

export const deleteProjectsEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.deleteAllProjects.match),
    switchMap(({ meta: { requestKey } }) =>
      from(api.deleteAllProjects()).pipe(
        mergeMap(() =>
          of(
            actions.requestLoaded(requestKey),
            allProjectsDeleted(),
            showSnackbar({
              message: `All projects have been deleted!`,
              type: "info",
            }),
          ),
        ),
        catchError((error) =>
          of(
            actions.requestFailed(error, requestKey),
            showSnackbar({ message: error, type: "error" }),
          ),
        ),
      ),
    ),
  );

export const clearProjectEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.clearProject.match),
    switchMap(({ payload: projectId, meta: { requestKey } }) =>
      from(api.clearProject(projectId)).pipe(
        mergeMap(() => {
          const project = selectProjectById(store$.value, projectId);

          return of(
            actions.requestLoaded(requestKey),
            projectCleared(projectId),
            showSnackbar({
              message: `Project "${project?.name}" has been cleared`,
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
