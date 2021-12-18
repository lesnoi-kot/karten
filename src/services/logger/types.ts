export interface Logger {
  debug(...args: any[]): void;
  error(...args: any[]): void;
}

const noop = (...args: any[]) => {};

export const NilLogger = {
  debug: noop,
  error: noop,
};
