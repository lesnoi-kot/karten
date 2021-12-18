import { RootState } from "app";

export function extraParam<T>() {
  return (_: RootState, a: T) => a;
}
