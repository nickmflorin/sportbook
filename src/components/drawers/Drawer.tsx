import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { Loading } from "~/components/loading/Loading";

export interface DrawerProps extends ComponentProps {
  readonly children: ReactNode;
  readonly loading?: boolean;
}

export const Drawer = ({ children, loading, ...props }: DrawerProps): JSX.Element => (
  <div {...props} className={classNames("drawer", props.className)}>
    <Loading loading={loading === true} overlay />
    {children}
  </div>
);
