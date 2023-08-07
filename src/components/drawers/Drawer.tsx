import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { CloseButton } from "~/components/buttons/CloseButton";
import { Loading } from "~/components/loading/Loading";

export interface DrawerProps extends ComponentProps {
  readonly children: ReactNode;
  readonly loading?: boolean;
  readonly onClose?: () => void;
}

export const Drawer = ({ children, loading, onClose, ...props }: DrawerProps): JSX.Element => (
  <div {...props} className={classNames("drawer", props.className)}>
    {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
    <Loading loading={loading === true} overlay />
    {children}
  </div>
);
