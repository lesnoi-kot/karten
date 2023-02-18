import { AnyAction } from "@reduxjs/toolkit";
import { Epic as ReduxEpic } from "redux-observable";
import { History } from "history";

import { DataStore } from "services/api";

import { createStore } from "./store";

export type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<Store["getState"]>;
export type AppDispatch = Store["dispatch"];
export type EpicDependencies = {
  api: DataStore;
  history: History;
};

export type Epic = ReduxEpic<AnyAction, AnyAction, RootState, EpicDependencies>;
