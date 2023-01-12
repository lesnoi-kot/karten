import { values, prop, propEq } from "ramda";
import { createSelector } from "reselect";

import { ID } from "models/types";
import { RootState } from "app";
import { extraParam } from "utils/selectors";

import { BoardsMap, sliceName } from "./slice";

export const selectBoards = (state: RootState): BoardsMap =>
  state.entities[sliceName].items;

export const selectBoardsIds = createSelector(selectBoards, Object.keys);

export const selectBoard = (state: RootState, id: ID) =>
  selectBoards(state)[id] ?? null;

export const selectBoardName = (state: RootState, id: ID): string =>
  selectBoards(state)[id]?.name ?? "";

export const selectBoardsIdsByProjectId = createSelector(
  [selectBoards, extraParam<ID>()],
  (boards, projectId) =>
    values(boards).filter(propEq("projectId", projectId)).map(prop("id")),
);
