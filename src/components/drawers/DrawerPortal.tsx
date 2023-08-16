"use client";
import { type ReactNode, useEffect, useState, useMemo } from "react";

import { createPortal } from "react-dom";

import { CloseButton } from "~/components/buttons/CloseButton";
import { Loading } from "~/components/loading/Loading";

const createRootElement = (id: string | number): HTMLElement => {
  const rootContainer = document.createElement("div");
  rootContainer.setAttribute("id", String(id));
  return rootContainer;
};

export const usePortal = (id: string | number | undefined): Element | null => {
  const [parent, setParent] = useState<Element | null>(null);

  useEffect(() => {
    if (id !== undefined) {
      const existingParent = document.querySelector(`#${id}`);
      const parentElem = existingParent || createRootElement(id);
      setParent(parentElem);
    }
  }, [id]);

  return parent;
};

const DRAWER_TARGET_SLOTS = [1, 2] as const;
type DrawerTargetSlot = (typeof DRAWER_TARGET_SLOTS)[number];
const DEFAULT_DRAWER_TARGET_SLOT: DrawerTargetSlot = 1;

type TargetAttempt = {
  readonly slots: DrawerTargetSlot[];
};

const getNextSlot = (attempt?: TargetAttempt): DrawerTargetSlot | null => {
  if (attempt === undefined || attempt.slots.length === 0) {
    return DEFAULT_DRAWER_TARGET_SLOT;
  }
  const leftover = DRAWER_TARGET_SLOTS.filter(s => !attempt.slots.includes(s));
  if (leftover.length === 0) {
    return null;
  }
  return leftover[0] as DrawerTargetSlot;
};

const getTarget = (attempt?: TargetAttempt): Element | null => {
  const slot = getNextSlot(attempt);
  if (slot === null) {
    // TODO: We should remove children here and return the last most recently used target.
    console.warn("");
    return null;
  }
  const tg = document.querySelector(`#drawer-target-${slot}`);
  if (tg) {
    if (tg.children.length === 0) {
      return tg;
    }
    return getTarget({ slots: attempt === undefined ? [slot] : [...attempt.slots, slot] });
  } else {
    console.warn("");
    return getTarget({ slots: attempt === undefined ? [slot] : [...attempt.slots, slot] });
  }
};

const useDrawerTarget = (open: boolean): Element | null =>
  useMemo(() => {
    if (open) {
      return getTarget();
    }
    // TODO: Remove child from target on close.
    return null;
  }, [open]);

/* const useDrawerPortal = (open: boolean) => {
     const [element, setElement] = useState<JSX.Element | null>(null);
     const target = useDrawerTarget(open); */

/*   useEffect(() => {
       if (target) {
         const el = createPortal(children, target);
         setElement(el);
       } else {
         setElement(null);
       }
     }, [target]);
     return;
   }; */

export interface DrawerPortalProps {
  readonly slot?: 1 | 2;
  readonly open: boolean;
  readonly loading?: boolean;
  readonly children: ReactNode;
  readonly instanceId: string;
  readonly onClose?: () => void;
}

export const PrivateDrawerPortal = ({ children, open }: Pick<DrawerPortalProps, "children" | "open">): JSX.Element => {
  const [element, setElement] = useState<JSX.Element | null>(null);
  const target = useDrawerTarget(open);

  useEffect(() => {
    if (target) {
      const el = createPortal(children, target);
      setElement(el);
    } else {
      setElement(null);
    }
  }, [target, children]);

  return <>{element}</>;
};

export const DrawerPortal = ({
  children,
  instanceId,
  onClose,
  loading,
  open,
  slot = 1,
}: DrawerPortalProps): JSX.Element => (
  <PrivateDrawerPortal open={open}>
    <div className="drawer-wrapper" id={instanceId}>
      {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
      <Loading loading={loading === true} />
      {children}
    </div>
  </PrivateDrawerPortal>
);

/* <Portal
     targetId="drawer-target-1"
     fallbackTargetId="drawer-target-2"
     open={open}
     // Remove old drawers from the portal target when a new one is opened.
     isExistingChild={element => {
       console.log(element);
       return element.classList.contains("drawer-wrapper") && element.id === instanceId;
     }}
   >
     <div className="drawer-wrapper" id={instanceId}>
       {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
       <Loading loading={loading === true} />
       {children}
     </div>
   </Portal> */

export default DrawerPortal;
