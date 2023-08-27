"use client";
import React, { useState, useCallback, useImperativeHandle, useRef } from "react";

import { Popover, type PopoverProps } from "@mantine/core/lib/Popover";
import { type Subtract } from "utility-types";

import { type IDropdownControl } from "./types";

export interface MinimalContentProps {
  readonly id?: string;
  readonly onFocus?: () => void;
}

export interface DropdownProps<P extends MinimalContentProps = MinimalContentProps>
  extends Pick<PopoverProps, "position" | "trapFocus" | "width" | "disabled"> {
  readonly opened?: boolean;
  readonly content: React.ReactElement<P>;
  readonly control?: React.MutableRefObject<IDropdownControl>;
  readonly contentProps?: Subtract<P, MinimalContentProps>;
  readonly keepOpen?: boolean; // For debugging purposes.
  readonly children: JSX.Element;
  readonly targetWidth?: number | string;
  readonly onClose?: () => void;
}

export const Dropdown = <P extends MinimalContentProps>({
  children,
  opened,
  content,
  targetWidth,
  keepOpen,
  disabled,
  control,
  contentProps,
  onClose,
  ...props
}: DropdownProps<P>): JSX.Element => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [_open, _setOpen] = useState(opened === undefined ? false : opened);

  const isOpen = keepOpen === true || (opened === undefined ? _open : opened);

  const close = useCallback(() => {
    _setOpen(false);
    onClose?.();
  }, [onClose]);

  const open = useCallback(() => {
    _setOpen(true);
    if (dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, []);

  useImperativeHandle(control, () => ({ close, open }));

  return (
    <Popover
      opened={isOpen}
      position="bottom"
      width="target"
      transitionProps={{ transition: "pop" }}
      {...props}
      disabled={disabled}
      onChange={() => close()}
    >
      <Popover.Target>
        <div style={targetWidth ? { width: targetWidth } : { maxWidth: "fit-content" }}>{children}</div>
      </Popover.Target>
      <Popover.Dropdown>
        {React.cloneElement<MinimalContentProps>(content, {
          ...contentProps,
        })}
      </Popover.Dropdown>
    </Popover>
  );
};

export default Dropdown;
