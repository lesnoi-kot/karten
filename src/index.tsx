import React from "react";
import ReactDOM from "react-dom";
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

const store = createStore();

ReactDOM.render(
  <React.StrictMode>
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
  </React.StrictMode>,
  document.getElementById("root")
);
