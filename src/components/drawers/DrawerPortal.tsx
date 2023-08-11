"use client";
import { type ReactNode } from "react";

import { CloseButton } from "~/components/buttons/CloseButton";
import { Loading } from "~/components/loading/Loading";
import { Portal } from "~/components/structural/Portal";

export interface DrawerPortalProps {
  readonly slot?: 1 | 2;
  readonly open: boolean;
  readonly loading?: boolean;
  readonly children: ReactNode;
  readonly onClose?: () => void;
}

export const DrawerPortal = ({ children, onClose, loading, open, slot = 1 }: DrawerPortalProps): JSX.Element => (
  <Portal
    targetId={`drawer-target-${slot}`}
    open={open}
    // Remove old drawers from the portal target when a new one is opened.
    isExistingChild={element => element.classList.contains("drawer-wrapper")}
  >
    <div className="drawer-wrapper">
      {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
      <Loading loading={loading === true} />
      {children}
    </div>
  </Portal>
);

export default DrawerPortal;
