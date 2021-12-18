import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { createLogger } from "redux-logger";
import { createBrowserHistory } from "history";

import { rootReducer } from "./reducers";
import { rootEpic } from "./epics";
import { apiService } from "./services";

export function createStore() {
  const reduxLogger = createLogger({
    level: "info",
    collapsed: true,
    logErrors: false,
  });

  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      api: apiService,
      history: createBrowserHistory(),
    },
  });

  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware(), reduxLogger, epicMiddleware],
  });

  // @ts-ignore
  epicMiddleware.run(rootEpic);

  return store;
}
