import { useRef } from "react";

export type ManagedDrawersHandler<N extends string> = {
  readonly open: (drawer: N | N[]) => void;
  readonly close: (drawer: N | N[] | "all") => void;
};

export const useManagedDrawers = <N extends string>() =>
  useRef<ManagedDrawersHandler<N>>({
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    open: () => {},
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    close: () => {},
  });
