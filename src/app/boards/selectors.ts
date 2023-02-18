import { values, prop, propEq, count } from "ramda";
import { createSelector } from "reselect";

import { ID, Board } from "models/types";
import { RootState } from "app";
import { extraParam } from "utils/selectors";

import { BoardsMap, sliceName } from "./slice";

export const selectBoards = (state: RootState): BoardsMap =>
  state.entities[sliceName].items;

export const selectBoardsIds = createSelector(selectBoards, Object.keys);
export const selectBoardsArray = createSelector(selectBoards, Object.values);

export const selectBoard = (state: RootState, id: ID): Board | null =>
  selectBoards(state)[id] ?? null;

export const selectBoardName = (state: RootState, id: ID): string =>
  selectBoards(state)[id]?.name ?? "";

export const selectBoardsIdsByProjectId = createSelector(
  [selectBoards, extraParam<ID>()],
  (boards, projectId) =>
    values(boards).filter(propEq("projectId", projectId)).map(prop("id")),
  {
    memoizeOptions: {
      maxSize: 20,
    },
  },
);

export const selectBoardsCountOfProject = createSelector(
  [selectBoardsArray, extraParam<ID>()],
  (boards, projectId) => count(propEq("projectId", projectId), boards),
  {
    memoizeOptions: {
      maxSize: 20,
    },
  },
);

export const selectLastViewedBoards = createSelector(
  selectBoardsArray,
  (boards) =>
    boards
      .map(({ id, dateLastViewed }) => ({
        id,
        dateLastViewed: new Date(dateLastViewed),
      }))
      .sort((a, b) => Number(b.dateLastViewed) - Number(a.dateLastViewed))
      .map(prop("id"))
      .slice(0, 4),
);
