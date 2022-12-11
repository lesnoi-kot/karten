const noop = (...args: any[]) => {};

export const NilLogger = {
  debug: noop,
  error: noop,
};

export default NilLogger;
