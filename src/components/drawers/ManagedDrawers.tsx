import { useReducer, type Reducer, useImperativeHandle } from "react";

import classNames from "classnames";
import difference from "lodash.difference";
import intersection from "lodash.intersection";
import uniq from "lodash.uniq";

import { logger } from "~/internal/logger";

import { Drawer, type DrawerProps } from "./Drawer";
import { DrawerView } from "./DrawerView";
import { type ManagedDrawersHandler } from "./hooks";

type ManagedDrawersState<N> = N[];

enum ManagedDrawerActionType {
  OPEN = "open",
  CLOSE = "close",
}

type ManagedDrawerOpenAction<
  N extends string,
  T extends ManagedDrawerActionType = ManagedDrawerActionType,
> = T extends ManagedDrawerActionType
  ? {
      [ManagedDrawerActionType.OPEN]: {
        readonly drawer: N | N[];
        readonly type: ManagedDrawerActionType.OPEN;
      };
      [ManagedDrawerActionType.CLOSE]: {
        readonly drawer: N | N[] | "all";
        readonly type: ManagedDrawerActionType.CLOSE;
      };
    }[T]
  : never;

const managedDrawerReducer = <N extends string>(
  state: ManagedDrawersState<N> = [],
  action: ManagedDrawerOpenAction<N>,
): ManagedDrawersState<N> => {
  switch (action.type) {
    case ManagedDrawerActionType.OPEN:
      return uniq(Array.isArray(action.drawer) ? action.drawer : [action.drawer]).reduce((prev: N[], curr: N) => {
        if (state.includes(curr)) {
          logger.warn(`Conflicting State: Drawer ${curr} is already in the opened state.")}`);
          return prev;
        }
        return [...prev, curr];
      }, state);
    case ManagedDrawerActionType.CLOSE:
      if (action.drawer === "all") {
        return [];
      }
      const toClose = uniq(Array.isArray(action.drawer) ? action.drawer : [action.drawer]);
      // Determine if there are any drawers being closed that are not opened in state.
      const conflicting = intersection(toClose, difference(toClose, state));
      if (conflicting.length !== 0) {
        logger.warn(`Conflicting State: Drawer(s) ${conflicting.join(", ")} are already in the closed state.")}`);
      }
      return state.reduce((prev: N[], curr: N) => {
        if (!toClose.includes(curr)) {
          logger.warn(`Conflicting State: Drawer ${curr} is already in the opened state.")}`);
          return [...prev, curr];
        }
        return prev;
      }, []);
  }
};

export interface ManagedDrawersProps<N extends string, A extends string> extends Omit<DrawerProps, "children"> {
  readonly drawers: Record<N | A, JSX.Element>;
  readonly defaultOpen?: N[];
  readonly alwaysOpen?: A[];
  readonly handler: React.Ref<ManagedDrawersHandler<N>>;
}

export const ManagedDrawers = <N extends string, A extends string>({
  drawers,
  defaultOpen = [],
  alwaysOpen = [],
  handler,
  onClose,
  ...props
}: ManagedDrawersProps<N, A>): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<ManagedDrawersState<N>, ManagedDrawerOpenAction<N>>>(
    managedDrawerReducer,
    defaultOpen,
  );

  useImperativeHandle(handler, () => ({
    open: (drawer: N | N[]) => dispatch({ type: ManagedDrawerActionType.OPEN, drawer }),
    close: (drawer: N | N[] | "all") => dispatch({ type: ManagedDrawerActionType.CLOSE, drawer }),
  }));

  return (
    <Drawer {...props} className={classNames("managed-drawers", props.className)}>
      {alwaysOpen.map((drawer, i) => (
        <DrawerView key={`static-${i}`} onClose={() => onClose?.()}>
          {drawers[drawer]}
        </DrawerView>
      ))}
      {state.map((drawer, i) => (
        <DrawerView key={`dynamic-${i}`} onClose={() => dispatch({ type: ManagedDrawerActionType.CLOSE, drawer })}>
          {drawers[drawer]}
        </DrawerView>
      ))}
    </Drawer>
  );
};
