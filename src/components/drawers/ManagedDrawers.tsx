import { useReducer, type Reducer, useImperativeHandle, useRef } from "react";

import classNames from "classnames";
import intersection from "lodash.intersection";

import { logger } from "~/internal/logger";

import { Drawer, type DrawerProps } from "./Drawer";
import { DrawerView } from "./DrawerView";

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
        readonly closeOthers?: boolean | N[];
      };
      [ManagedDrawerActionType.CLOSE]: {
        readonly drawer: N | N[];
        readonly type: ManagedDrawerActionType.CLOSE;
        readonly openOthers?: N[];
      };
    }[T]
  : never;

const managedDrawerReducer = <N extends string>(
  state: ManagedDrawersState<N> = [],
  action: ManagedDrawerOpenAction<N>,
): ManagedDrawersState<N> => {
  const toToggle = Array.isArray(action.drawer) ? action.drawer : [action.drawer];
  switch (action.type) {
    case ManagedDrawerActionType.OPEN:
      let toClose =
        action.closeOthers === true ? state.filter(v => !toToggle.includes(v)) : [...(action.closeOthers || [])];
      const conflictsWhileClosing = intersection(toToggle, toClose);
      if (conflictsWhileClosing.length !== 0) {
        logger.warn(
          `Conflicting State: Drawer(s) ${conflictsWhileClosing.join(", ")} cannot be both opened and closed.")}`,
        );
      }
      toClose = toClose.filter(v => !toToggle.includes(v));
      return [...state.filter(v => !toClose.includes(v)), ...toToggle];
    case ManagedDrawerActionType.CLOSE:
      let toAlsoOpen = action.openOthers || [];
      const conflictsWhileOpening = intersection(toToggle, toAlsoOpen);
      if (conflictsWhileOpening.length !== 0) {
        logger.warn(
          `Conflicting State: Drawer(s) ${conflictsWhileOpening.join(", ")} cannot be both opened and closed.")}`,
        );
      }
      toAlsoOpen = toAlsoOpen.filter(v => !toToggle.includes(v));
      return [...state.filter(v => !toToggle.includes(v)), ...toAlsoOpen];
  }
};

export type ManagedDrawersHandler<N extends string> = {
  readonly open: (drawer: N | N[], closeOthers?: boolean | N[]) => void;
  readonly close: (drawer: N | N[], openOthers?: N[]) => void;
};

export const useManagedDrawers = <N extends string>() =>
  useRef<ManagedDrawersHandler<N>>({
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    open: () => {},
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    close: () => {},
  });

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
    open: (drawer: N | N[], closeOthers?: boolean | N[]) =>
      dispatch({ type: ManagedDrawerActionType.OPEN, drawer, closeOthers }),
    close: (drawer: N | N[], openOthers?: N[]) => dispatch({ type: ManagedDrawerActionType.CLOSE, drawer, openOthers }),
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
