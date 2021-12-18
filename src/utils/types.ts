export enum FetchState {
  INITIAL = "initial",
  FULFILLED = "fulfilled",
  PENDING = "pending",
  FAILED = "failed",
}

export type SetLike<T extends string | number | symbol> = Record<T, boolean>;
