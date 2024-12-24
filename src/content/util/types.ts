export type LoadableState<T> =
  | {
      status: "idle";
    }
  | {
      status: "loading";
    }
  | {
      status: "loaded";
      value: T;
    }
  | {
      status: "error";
      error: unknown;
    };
