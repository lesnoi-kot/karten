import "react-redux";
import type { RootState } from "app/types";

declare module "react-redux" {
  export interface DefaultRootState extends RootState {}
}
