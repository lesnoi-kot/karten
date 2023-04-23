import { of, from } from "rxjs";
import { filter, mergeMap, catchError } from "rxjs/operators";

import { userLoggedIn, userLoggedOut } from "app/users";
import { projectsSet } from "app/projects";
import { normalizeProjects } from "app/projects/utils";
import { showSnackbar } from "app/snackbars";

import { Epic } from "../types";
import { actions } from "./slice";

export const getCurrentUserEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.getCurrentUser.match),
    mergeMap(({ meta: { requestKey } }) =>
      from(api.getCurrentUser()).pipe(
        mergeMap((user) =>
          user === null
            ? of(actions.requestLoaded(requestKey))
            : of(userLoggedIn(user), actions.requestLoaded(requestKey)),
        ),
        catchError((error) => of(actions.requestFailed(error, requestKey))),
      ),
    ),
  );

export const logOutEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.logOut.match),
    mergeMap(({ meta: { requestKey } }) =>
      from(api.logOut()).pipe(
        mergeMap(() => of(userLoggedOut(), actions.requestLoaded(requestKey))),
        catchError((error) => of(actions.requestFailed(error, requestKey))),
      ),
    ),
  );

export const logInAsGuestEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.logInAsGuest.match),
    mergeMap(({ meta: { requestKey } }) =>
      from(api.logInAsGuest()).pipe(
        mergeMap((user) =>
          of(userLoggedIn(user), actions.requestLoaded(requestKey)),
        ),
        catchError((error) => of(actions.requestFailed(error, requestKey))),
      ),
    ),
  );

export const deleteUserEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(actions.deleteUser.match),
    mergeMap(({ meta: { requestKey } }) =>
      from(api.deleteUser()).pipe(
        mergeMap(() => of(userLoggedOut(), actions.requestLoaded(requestKey))),
        catchError((error) => of(actions.requestFailed(error, requestKey))),
      ),
    ),
  );

export const userLoggedInEpic: Epic = (action$, store$, { api }) =>
  action$.pipe(
    filter(userLoggedIn.match),
    mergeMap(() =>
      from(api.getProjects({ includeBoards: false })).pipe(
        mergeMap((projectsArr) => {
          const { projects } = normalizeProjects(projectsArr);
          return of(projectsSet(projects));
        }),
        catchError((error) =>
          of(showSnackbar({ message: String(error), type: "error" })),
        ),
      ),
    ),
  );
