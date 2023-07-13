"use client";
import classNames from "classnames";

import { CloseButton } from "~/components/buttons";
import { PartitionedContent, type PartitionedContentProps } from "~/components/structural/PartitionedContent";
import { Portal } from "~/components/structural/Portal";

export interface DrawerProps extends Omit<PartitionedContentProps, "container"> {
  readonly open: boolean;
  readonly onClose?: () => void;
}

export const Drawer = ({ open, children, onClose, ...props }: DrawerProps): JSX.Element => {
  if (open) {
    return (
      <Portal id="drawer-target">
        <PartitionedContent {...props} className={classNames("drawer", props.className)}>
          {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
          {children}
        </PartitionedContent>
      </Portal>
    );
  }
  return <></>;
};
