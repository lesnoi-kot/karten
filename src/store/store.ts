import { configureStore, Middleware } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";

import { rootReducer } from "./reducers";

export function createStore() {
  const middleware: Middleware[] = [];

  if (import.meta.env.VITE_NODE_ENV !== "production") {
    const reduxLogger = createLogger({
      level: "info",
      collapsed: true,
      logErrors: false,
    });

    middleware.push(reduxLogger);
  }

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(middleware),
    devTools: import.meta.env.VITE_NODE_ENV !== "production",
  });

  return store;
}
