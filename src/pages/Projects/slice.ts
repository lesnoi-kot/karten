import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "app";
import { FetchState } from "utils/types";

import { actions as apiActions } from "app/apiInteraction";

interface ProjectsState {
  fetchState: FetchState;
}

const initialState: ProjectsState = {
  fetchState: FetchState.INITIAL,
};

export const { actions, reducer, name: sliceName } = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(apiActions.boardsRequest, (state) => {
        state.fetchState = FetchState.PENDING;
      })
      .addCase(apiActions.boardsRequestLoaded, (state) => {
        state.fetchState = FetchState.FULFILLED;
      })
      .addCase(apiActions.boardsRequestFailed, (state, { payload: error }) => {
        state.fetchState = FetchState.FAILED;
      });
  },
});

export const selectFetchState = (state: RootState) =>
  state.pages[sliceName].fetchState;
