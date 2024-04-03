export type EndToEndFlowAtom<T> = {
  setup: () => Promise<T>;
  teardown: (data: T) => Promise<void>;
};
