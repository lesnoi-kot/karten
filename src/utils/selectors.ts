import { RootState } from "app";

export function extraParam<T>() {
  return (_: RootState, a: T) => a;
}

export function compareDateStrings(a: string, b: string): number {
  return new Date(a).valueOf() - new Date(b).valueOf();
}
