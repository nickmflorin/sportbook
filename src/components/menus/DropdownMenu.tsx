"use client";
import React, { useState, useMemo } from "react";

import { Popover } from "@mantine/core";

import { type Style } from "~/lib/ui";
import { SolidButton } from "~/components/buttons/SolidButton";

interface BaseDropdownMenuProps {
  readonly open?: boolean;
  readonly menu: JSX.Element;
  readonly onClose?: () => void;
}

export interface DropdownMenuChildrenProps extends BaseDropdownMenuProps {
  readonly children: JSX.Element;
  readonly buttonText?: never;
  readonly buttonStyle?: never;
}

export interface DropdownMenuChildlessProps extends BaseDropdownMenuProps {
  readonly buttonText: string;
  readonly buttonStyle?: Style;
  readonly children?: never;
}

export type DropdownMenuProps = DropdownMenuChildrenProps | DropdownMenuChildlessProps;

export const DropdownMenu = ({
  children,
  open,
  buttonStyle,
  buttonText,
  menu,
  onClose,
}: DropdownMenuProps): JSX.Element => {
  const [_open, setOpen] = useState(false);

  const isOpen = open === undefined ? _open : open;

  const target = useMemo(() => {
    if (children === undefined) {
      return (
        <SolidButton.Secondary
          style={buttonStyle}
          icon={isOpen ? { name: "chevron-up" } : { name: "chevron-down" }}
          iconLocation="right"
          onFocusCapture={() => setOpen(true)}
          onBlurCapture={() => {
            setOpen(false);
            onClose?.();
          }}
        >
          {buttonText}
        </SolidButton.Secondary>
      );
    }
    return children;
  }, [children, buttonText, buttonStyle, isOpen, onClose]);

  return (
    <Popover position="bottom" width="target" transitionProps={{ transition: "pop" }} trapFocus>
      <Popover.Target>
        <div
          style={{ maxWidth: "fit-content" }}
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
