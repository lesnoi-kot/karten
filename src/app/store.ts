import { configureStore } from "@reduxjs/toolkit";
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
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        reduxLogger,
        epicMiddleware,
      ),
    devTools: import.meta.env.VITE_NODE_ENV !== "production",
  });

  epicMiddleware.run(rootEpic);

  return store;
}
