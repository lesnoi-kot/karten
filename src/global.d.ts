import "react-redux";
import type { RootState } from "app/types";

declare module "react-redux" {
  export type DefaultRootState = RootState;
}

type VoidFunction = () => void;
