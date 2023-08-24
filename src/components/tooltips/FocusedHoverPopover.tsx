import React, { type ReactNode } from "react";

import { HoverCard, type HoverCardProps } from "./HoverCard";

export type FocusedHoverPopoverProps = Omit<HoverCardProps, "children" | "popover">;

interface _FocusedHoverPopoverProps extends FocusedHoverPopoverProps {
  readonly children: ReactNode;
  readonly popover?: HoverCardProps["popover"];
}

export const FocusedHoverPopover = ({ children, ...props }: _FocusedHoverPopoverProps): JSX.Element => (
  <HoverCard {...props}>{children}</HoverCard>
);
