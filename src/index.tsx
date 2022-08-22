import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import StylesProvider from "@mui/styles/StylesProvider";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import { createStore } from "./app/store";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#fff",
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container!);
const store = createStore();

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <StylesProvider injectFirst>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DndProvider backend={HTML5Backend}>
              <App />
            </DndProvider>
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </StylesProvider>
  </Provider>
  // </React.StrictMode>
);
