import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { CloseButton } from "~/components/buttons";
import { Portal } from "~/components/structural/Portal";

export interface DrawerProps extends ComponentProps {
  readonly open: boolean;
  readonly children: ReactNode;
  readonly onClose?: () => void;
}

export const Drawer = ({ open, children, onClose, ...props }: DrawerProps): JSX.Element => {
  if (open) {
    return (
      <Portal id="drawer-target">
        <div {...props} className={classNames("drawer", props.className)}>
          {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
          {children}
        </div>
      </Portal>
    );
  }
  return <></>;
};
