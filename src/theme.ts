import { grey } from "@mui/material/colors";
import {
  responsiveFontSizes,
  experimental_extendTheme,
} from "@mui/material/styles";

export const appTheme = responsiveFontSizes(
  experimental_extendTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: {
            color: "tomato",
            "&$error": {
              color: "tomato",
            },
          },
        },
      },
    },
    colorSchemes: {
      dark: {
        palette: {
          surfaces: {
            light: "#191919",
          },
        },
      },
      light: {
        palette: {
          surfaces: {
            light: grey[50],
          },
        },
      },
    },
    typography: {
      fontSize: 16,
    },
  }),
);
