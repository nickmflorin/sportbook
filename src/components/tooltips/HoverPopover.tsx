"use client";
import React, { useState } from "react";

import { Popover, type PopoverProps } from "./Popover";

type HoverableElementProps = {
  readonly onMouseEnter: () => void;
  readonly onMouseLeave: () => void;
};

export type HoverPopoverProps = Omit<PopoverProps, "open" | "children" | "popover"> & {
  readonly defaultOpen?: boolean;
};

interface _HoverPopoverProps<P extends HoverableElementProps> extends HoverPopoverProps {
  readonly children: React.ReactElement<P>;
  readonly popover?: PopoverProps["popover"];
}

export const HoverPopover = <P extends HoverableElementProps>({
  children,
  defaultOpen = false,
  ...props
}: _HoverPopoverProps<P>): JSX.Element => {
  const [hovered, setHovered] = useState(defaultOpen);

  return (
    <Popover {...props} open={hovered}>
      {React.cloneElement<HoverableElementProps>(children, {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      })}
    </Popover>
  );
};
