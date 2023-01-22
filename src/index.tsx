import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  responsiveFontSizes,
  Experimental_CssVarsProvider,
  experimental_extendTheme,
} from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";
import CssBaseline from "@mui/material/CssBaseline";

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

const store = createStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Experimental_CssVarsProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <App />
    </Experimental_CssVarsProvider>
  </Provider>,
);
