import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  responsiveFontSizes,
  Experimental_CssVarsProvider,
  experimental_extendTheme,
} from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";
import CssBaseline from "@mui/material/CssBaseline";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { createStore } from "./app/store";

import "./index.css";

const theme = responsiveFontSizes(
  experimental_extendTheme({
    colorSchemes: {
      dark: {
        palette: {
          primary: {
            main: "#000",
          },
        },
      },
      light: {
        palette: {
          background: {
            default: "#f0f2f4",
          },
          primary: {
            main: "#ff9800",
          },
        },
      },
    },
    typography: {
      fontSize: 16,
    },
  }),
);

const container = document.getElementById("root");
const root = createRoot(container!);
const store = createStore();

root.render(
  <Provider store={store}>
    <Experimental_CssVarsProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <BrowserRouter basename="/">
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </BrowserRouter>
    </Experimental_CssVarsProvider>
  </Provider>,
);
