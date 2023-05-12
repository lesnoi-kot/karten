import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type {} from "@mui/material/themeCssVarsAugmentation";

import { APIContext } from "context/APIProvider";
import { getDataStore } from "services/api";
import { createStore } from "store/store";

import App from "./App";
import { appTheme } from "./theme";
import "./index.css";

const store = createStore();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // staleTime: 1000,
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <CssVarsProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      <StyledEngineProvider injectFirst>
        <QueryClientProvider client={queryClient}>
          <APIContext.Provider value={getDataStore()}>
            <App />
          </APIContext.Provider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </StyledEngineProvider>
    </CssVarsProvider>
  </Provider>,
);
