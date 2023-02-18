import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import {
  responsiveFontSizes,
  Experimental_CssVarsProvider,
  experimental_extendTheme,
} from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";
import CssBaseline from "@mui/material/CssBaseline";

import { APIContext } from "context/APIProvider";
import { getDataStore } from "services/api";
import { createStore } from "app/store";

import App from "./App";

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
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Experimental_CssVarsProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <QueryClientProvider client={queryClient}>
        <APIContext.Provider value={getDataStore()}>
          <App />
        </APIContext.Provider>
      </QueryClientProvider>
    </Experimental_CssVarsProvider>
  </Provider>,
);
