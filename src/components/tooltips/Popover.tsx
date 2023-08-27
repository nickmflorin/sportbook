"use client";
import React from "react";

import { Popover as RootPopover, type PopoverProps as RootPopoverProps } from "@mantine/core/lib/Popover";

export interface PopoverProps extends Omit<RootPopoverProps, "opened" | "children"> {
  readonly open: boolean;
  readonly popover?: JSX.Element | null | undefined;
  readonly keepOpen?: boolean;
  readonly children: JSX.Element;
}

export const Popover = ({ children, popover, open, keepOpen = false, ...props }: PopoverProps): JSX.Element => {
  if (popover === undefined || popover === null) {
    return <>{children}</>;
  }
  return (
    <RootPopover width="target" transitionProps={{ transition: "pop" }} {...props} opened={open || keepOpen}>
      <RootPopover.Target>{children}</RootPopover.Target>
      <RootPopover.Dropdown className="popover">{popover}</RootPopover.Dropdown>
    </RootPopover>
  );
};
