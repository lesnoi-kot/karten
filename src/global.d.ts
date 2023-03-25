import "react-redux";
import type { RootState } from "app/types";

type VoidFunction = () => void;

declare module "react-redux" {
  export type DefaultRootState = RootState;
}

declare module "@mui/material/styles" {
  interface Palette {
    surfaces: {
      light: string;
    };
  }

  interface PaletteOptions {
    surfaces: {
      light?: string;
    };
  }
}
