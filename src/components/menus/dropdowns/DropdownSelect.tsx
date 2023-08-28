"use client";
import React, { useState, useImperativeHandle, useCallback } from "react";

import { type Style } from "~/lib/ui";
import { DropdownButton } from "~/components/buttons/DropdownButton";

import { ValuedMenu, type ValuedMenuProps } from "../menus/ValuedMenu";
import { type MenuSelectionMode } from "../menus/types";

import { Dropdown, type DropdownProps, type MinimalContentProps } from "./Dropdown";
import { useDropdownControl } from "./hooks";
import { type IDropdownSelectControl } from "./types";

interface MinimalMenuProps extends MinimalContentProps {
  readonly loading?: boolean;
}

export type ValueDisplay = JSX.Element | string | null;

type Base = Omit<
  DropdownProps<MinimalMenuProps>,
  "children" | "contentProps" | "targetWidth" | "control" | "open" | "onClose" | "content"
>;

export type DropdownSelectProps<V extends string | null, M, MODE extends MenuSelectionMode = MenuSelectionMode> = Omit<
  ValuedMenuProps<V, M, MODE>,
  "id"
> &
  Base & {
    readonly fetching?: boolean;
    readonly refetching?: boolean;
    readonly disableWhenFetching?: boolean;
    readonly disableWhenRefetching?: boolean;
    readonly valueDisplay?: JSX.Element | string | null;
    readonly inputPlaceholder?: string;
    readonly inputStyle?: Omit<Style, "width">;
    readonly inputWidth?: string | number;
    readonly control?: React.MutableRefObject<IDropdownSelectControl>;
    readonly clearDisabled?: boolean;
    readonly onClear?: () => void;
  };

export const DropdownSelect = <V extends string | null, M, MODE extends MenuSelectionMode = MenuSelectionMode>({
  control,
  fetching,
  refetching,
  inputWidth,
  inputStyle,
  inputPlaceholder,
  disabled,
  clearDisabled,
  onClear,
  valueDisplay = null,
  disableWhenFetching = true,
  disableWhenRefetching = false,
  style,
  ...props
}: DropdownSelectProps<V, M, MODE>): JSX.Element => {
  type MenuProps = ValuedMenuProps<V, M, MODE>;
  const { items, shortcuts, footerActions, mode, value, onChange, defaultValue, ...rest } = props;

  const _onChange = useCallback(
    (...args: Parameters<NonNullable<MenuProps["onChange"]>>) => {
      if (value && datum) {
        const valueRendered = valueRenderer === undefined ? getItemLabel(datum) : valueRenderer(datum);
        control.current.setValueDisplay(valueRendered);
      } else {
        control.current.setValueDisplay(null);
      }
      if (closeOnItemClick === true) {
        control.current.close();
      }
      _onChange(value, datum);
    },
    [_onChange, getItemLabel, valueRenderer, closeOnItemClick, control],
  );

  let menuProps = { items, shortcuts, footerActions, mode, value, onChange, defaultValue } as MenuProps;

  const dropdownControl = useDropdownControl();
  const [opened, setOpen] = useState(false);

  const dropdownDisabled = disabled || (disableWhenFetching && fetching) || (disableWhenRefetching && refetching);

  /* We might have to iron out discrepancies between disabled states of the menu and the input when loading indicates
     either "input" and/or "content". */
  // const _disabled = disabled || (disableWhenLoading && loadingIncludesInput(loading));
  const [_valueDisplay, setValueDisplay] = useState<ValueDisplay>(valueDisplay);

  useImperativeHandle(control, () => ({ ...dropdownControl.current, setValueDisplay }));

  return (
    <Dropdown<MinimalMenuProps>
      {...rest}
      contentProps={{ loading: refetching }}
      onClose={() => setOpen(false)}
      content={
        <ValuedMenu<V, M>
          {...menuProps}
          // items={items}
          // footerActions={footerActions}
          // mode={mode}
          // shortcuts={shortcuts}
          // value={value}
          // onChange={value => onChange(value, datum)}
          // withCheckbox
        />
      }
    >
      <DropdownButton
        open={opened}
        disabled={dropdownDisabled}
        style={inputStyle}
        width={inputWidth}
        onClick={() => setOpen(true)}
        onClear={onClear}
        clearDisabled={clearDisabled}
        loading={fetching || refetching}
        placeholder={_valueDisplay === null}
      >
        {_valueDisplay === null ? inputPlaceholder || "Placeholder" : _valueDisplay}
      </DropdownButton>
    </Dropdown>
  );
};

export default DropdownSelect;
