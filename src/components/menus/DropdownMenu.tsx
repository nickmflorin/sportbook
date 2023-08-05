"use client";
import React, { useState, useMemo } from "react";

import { Popover, type PopoverProps } from "@mantine/core";

import { type Style } from "~/lib/ui";
import { SolidButton } from "~/components/buttons/SolidButton";

interface BaseDropdownMenuProps extends Pick<PopoverProps, "position" | "trapFocus" | "width"> {
  readonly open?: boolean;
  readonly menu: JSX.Element;
  readonly onClose?: () => void;
}

export interface DropdownMenuChildrenProps extends BaseDropdownMenuProps {
  readonly children: JSX.Element;
  readonly buttonText?: never;
  readonly buttonStyle?: never;
  readonly buttonWidth?: never;
}

export interface DropdownMenuChildlessProps extends BaseDropdownMenuProps {
  readonly buttonText: string;
  readonly buttonStyle?: Omit<Style, "width">;
  readonly buttonWidth?: number | string;
  readonly children?: never;
}

export type DropdownMenuProps = DropdownMenuChildrenProps | DropdownMenuChildlessProps;

export const DropdownMenu = ({
  children,
  open,
  buttonStyle,
  buttonText,
  menu,
  buttonWidth,
  onClose,
  ...props
}: DropdownMenuProps): JSX.Element => {
  const [_open, setOpen] = useState(false);

  const isOpen = open === undefined ? _open : open;

  const target = useMemo(() => {
    if (children === undefined) {
      return (
        <SolidButton.Outline
          style={{ textAlign: "left", ...buttonStyle, width: buttonWidth }}
          icon={isOpen ? { name: "chevron-up" } : { name: "chevron-down" }}
          iconLocation="right"
          onFocusCapture={() => setOpen(true)}
          onBlurCapture={() => {
            setOpen(false);
            onClose?.();
          }}
        >
          {buttonText}
        </SolidButton.Outline>
      );
    }
    return children;
  }, [children, buttonText, buttonStyle, buttonWidth, isOpen, onClose]);

  return (
    <Popover position="bottom" width="target" transitionProps={{ transition: "pop" }} trapFocus {...props}>
      <Popover.Target>
        <div
          style={buttonWidth ? { width: buttonWidth } : { maxWidth: "fit-content" }}
          onFocusCapture={() => setOpen(true)}
          onBlurCapture={() => {
            setOpen(false);
            onClose?.();
          }}
        >
          {target}
        </div>
      </Popover.Target>
      <Popover.Dropdown>{menu}</Popover.Dropdown>
    </Popover>
  );
};

export default DropdownMenu;
