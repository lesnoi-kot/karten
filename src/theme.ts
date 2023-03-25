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
            50: "#191919",
            100: grey[900],
          },
        },
      },
      light: {
        palette: {
          surfaces: grey,
        },
      },
    },
    typography: {
      fontSize: 16,
    },
  }),
);
