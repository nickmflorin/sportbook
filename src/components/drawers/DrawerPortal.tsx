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
  /* There will be times when we want to render the drawer wrapper in the layout with a loading indicator before the
     content is ready to be shown. */
  <Portal id={`drawer-target-${slot}`} open={open}>
    <div className="drawer-wrapper">
      {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
      <Loading loading={loading === true} />
      {children}
    </div>
  </Portal>
);

export default DrawerPortal;
