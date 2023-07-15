import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { CloseButton } from "~/components/buttons";

export interface DrawerViewProps extends ComponentProps {
  readonly children: JSX.Element;
  readonly onClose?: () => void;
}

export const DrawerView = ({ children, onClose, ...props }: DrawerViewProps): JSX.Element => (
  <div {...props} className={classNames("drawer-view", props.className)}>
    {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
    {children}
  </div>
);
