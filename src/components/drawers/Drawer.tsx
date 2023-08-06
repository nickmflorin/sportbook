import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { CloseButton } from "~/components/buttons/CloseButton";

export interface DrawerProps extends ComponentProps {
  readonly children: ReactNode;
  readonly onClose?: () => void;
}

export const Drawer = ({ children, onClose, ...props }: DrawerProps): JSX.Element => (
  <div {...props} className={classNames("drawer", props.className)}>
    {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
    {children}
  </div>
);
