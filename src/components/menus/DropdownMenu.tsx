"use client";
import React, { useState, useMemo, useImperativeHandle, useEffect } from "react";

import { Popover, type PopoverProps } from "@mantine/core/lib/Popover";

import { type Style } from "~/lib/ui";
import { DropdownButton } from "~/components/buttons/DropdownButton";

import { type IDropdownMenu } from "./hooks";

interface BaseDropdownMenuProps extends Pick<PopoverProps, "position" | "trapFocus" | "width"> {
  readonly open?: boolean;
  readonly menu: JSX.Element;
  readonly dropdownMenu?: React.MutableRefObject<IDropdownMenu>;
  readonly onClose?: () => void;
}

export interface DropdownMenuChildrenProps extends BaseDropdownMenuProps {
  readonly children: JSX.Element;
  readonly buttonContent?: never;
  readonly buttonStyle?: never;
  readonly buttonWidth?: never;
}

export interface DropdownMenuChildlessProps extends BaseDropdownMenuProps {
  readonly buttonContent: string | JSX.Element;
  readonly buttonStyle?: Omit<Style, "width">;
  readonly buttonWidth?: number | string;
  readonly children?: never;
}

export type DropdownMenuProps = DropdownMenuChildrenProps | DropdownMenuChildlessProps;

export const DropdownMenu = ({
  children,
  open,
  buttonStyle,
  buttonContent,
  menu,
  buttonWidth,
  dropdownMenu,
  onClose,
  ...props
}: DropdownMenuProps): JSX.Element => {
  const [_open, setOpen] = useState(open === undefined ? false : open);
  const [_buttonContent, setButtonContent] = useState<string | JSX.Element | undefined>(buttonContent);

  const isOpen = open === undefined ? _open : open;

  useEffect(() => {
    if (isOpen === false) {
      onClose?.();
    }
  }, [isOpen]);

  useImperativeHandle(dropdownMenu, () => ({ setButtonContent, close: () => setOpen(false) }));

  const target = useMemo(() => {
    if (children === undefined) {
      return (
        <DropdownButton
          open={isOpen}
          style={buttonStyle}
          width={buttonWidth}
          onClick={() => setOpen((o: boolean) => !o)}
        >
          {_buttonContent}
        </DropdownButton>
      );
    }
    return children;
  }, [children, _buttonContent, buttonStyle, buttonWidth, isOpen, setOpen]);

  return (
    <Popover
      opened={isOpen}
      position="bottom"
      width="target"
      transitionProps={{ transition: "pop" }}
      trapFocus
      {...props}
    >
      <Popover.Target>
        <div style={buttonWidth ? { width: buttonWidth } : { maxWidth: "fit-content" }}>{target}</div>
      </Popover.Target>
      <Popover.Dropdown onBlur={() => setOpen(false)}>{menu}</Popover.Dropdown>
    </Popover>
  );
};

export default DropdownMenu;
