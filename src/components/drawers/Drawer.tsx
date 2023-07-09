"use client";
import classNames from "classnames";

import { Portal } from "~/components/layout/Portal";
import { PartitionedContent, type PartitionedContentProps } from "~/components/structural/PartitionedContent";

export interface DrawerProps extends Omit<PartitionedContentProps, "container"> {
  readonly open: boolean;
}

export const Drawer = ({ open, children, ...props }: DrawerProps): JSX.Element => {
  if (open) {
    return (
      <Portal id="drawer-target">
        <PartitionedContent {...props} className={classNames("drawer", props.className)}>
          {children}
        </PartitionedContent>
      </Portal>
    );
  }
  return <></>;
};
