import { of, from } from "rxjs";
import { filter, mergeMap, catchError } from "rxjs/operators";

import { currentUserAdded } from "app/users";

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
            : of(currentUserAdded(user), actions.requestLoaded(requestKey)),
        ),
        catchError((error) => of(actions.requestFailed(error, requestKey))),
      ),
    ),
  );
