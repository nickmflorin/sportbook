"use client";
import { Select as RootSelect, type SelectProps as RootSelectProps } from "@mantine/core";
import { Loader } from "@mantine/core";

export type BaseSelectOption<V = string> = { value: V; label: string };

export interface SelectProps<O extends BaseSelectOption<V>, V extends string = O["value"]>
  extends Omit<RootSelectProps, "data" | "onChange" | "onError"> {
  readonly loading?: boolean;
  readonly data: O[];
  readonly onChange: (v: V) => void;
}

export const Select = <O extends BaseSelectOption<V>, V extends string = O["value"]>({
  loading,
  ...props
}: SelectProps<O, V>): JSX.Element => (
  <RootSelect
    clearable
    {...props}
    rightSection={loading ? <Loader size="xs" color="gray.6" /> : props.rightSection}
    disabled={props.disabled || loading}
    styles={{ rightSection: { display: "flex !important" } }}
  />
);
