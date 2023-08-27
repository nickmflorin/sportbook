"use client";
import React, { useState, useImperativeHandle } from "react";

import { type Style } from "~/lib/ui";
import { DropdownButton } from "~/components/buttons/DropdownButton";

import { Dropdown, type DropdownProps, type MinimalContentProps } from "./Dropdown";
import { useDropdownControl } from "./hooks";
import { type IDropdownSelectControl } from "./types";

interface MinimalMenuProps extends MinimalContentProps {
  readonly loading?: boolean;
}

type LoadingScheme = "input" | "content" | ["input", "content"] | ["content", "input"] | null;

const loadingIncludesInput = (
  loading?: LoadingScheme,
): loading is "input" | ["input", "content"] | ["content", "input"] =>
  (typeof loading === "string" && loading === "input") || (Array.isArray(loading) && loading.includes("input"));

const loadingIncludesContent = (
  loading?: LoadingScheme,
): loading is "content" | ["input", "content"] | ["content", "input"] =>
  (typeof loading === "string" && loading === "content") || (Array.isArray(loading) && loading.includes("content"));

export type ValueDisplay = JSX.Element | string | null;

export interface DropdownSelectProps
  extends Omit<
    DropdownProps<MinimalMenuProps>,
    "children" | "contentProps" | "targetWidth" | "control" | "open" | "onClose"
  > {
  readonly loading?: LoadingScheme;
  readonly disableWhenLoading?: boolean;
  readonly valueDisplay?: JSX.Element | string | null;
  readonly inputPlaceholder?: string;
  readonly inputStyle?: Omit<Style, "width">;
  readonly inputWidth?: string | number;
  readonly control?: React.MutableRefObject<IDropdownSelectControl>;
  readonly clearDisabled?: boolean;
  readonly onClose?: () => void;
  readonly onClear?: () => void;
}

export const DropdownSelect = ({
  control,
  loading,
  inputWidth,
  inputStyle,
  inputPlaceholder,
  disabled,
  clearDisabled,
  onClear,
  valueDisplay = null,
  disableWhenLoading = true,
  ...props
}: DropdownSelectProps): JSX.Element => {
  const dropdownControl = useDropdownControl();
  const [opened, setOpen] = useState(false);

  /* We might have to iron out discrepancies between disabled states of the menu and the input when loading indicates
     either "input" and/or "content". */
  const _disabled = disabled || (disableWhenLoading && loadingIncludesInput(loading));
  const [_valueDisplay, setValueDisplay] = useState<ValueDisplay>(valueDisplay);

  useImperativeHandle(control, () => ({ ...dropdownControl.current, setValueDisplay }));

  return (
    <Dropdown<MinimalMenuProps>
      control={dropdownControl}
      targetWidth={inputWidth}
      disabled={disabled}
      {...props}
      opened={opened}
      contentProps={{ loading: loadingIncludesContent(loading) }}
      onClose={() => setOpen(false)}
    >
      <DropdownButton
        open={opened}
        disabled={_disabled}
        style={inputStyle}
        width={inputWidth}
        onClick={() => setOpen(true)}
        onClear={onClear}
        clearDisabled={clearDisabled}
        loading={loadingIncludesInput(loading)}
        placeholder={_valueDisplay === null}
      >
        {_valueDisplay === null ? inputPlaceholder || "Placeholder" : _valueDisplay}
      </DropdownButton>
    </Dropdown>
  );
};

export default DropdownSelect;
