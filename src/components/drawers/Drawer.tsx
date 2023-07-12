"use client";
import { IconX } from "@tabler/icons-react";
import classNames from "classnames";

import { ActionIcon } from "~/components/buttons/ActionIcon";
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
          {onClose && <ActionIcon className="drawer__close-button" icon={IconX} onClick={onClose} />}
          {children}
        </PartitionedContent>
      </Portal>
    );
  }
  return <></>;
};
