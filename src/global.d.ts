import "react-redux";
import type { RootState } from "app/types";
import type { Color } from "@mui/material";

type VoidFunction = () => void;

declare module "react-redux" {
  export type DefaultRootState = RootState;
}

declare module "@mui/material/styles" {
  interface Palette {
    surfaces: Color;
  }

  interface PaletteOptions {
    surfaces: Partial<Color>;
  }
}
