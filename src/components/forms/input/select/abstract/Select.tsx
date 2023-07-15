"use client";
import { Select as RootSelect, type SelectProps as RootSelectProps } from "@mantine/core";
import { Loader } from "@mantine/core";
import classNames from "classnames";

import { type icons, type Color } from "~/lib/ui";
import { Icon } from "~/components/display/icons";
import { Text } from "~/components/typography";

import { createSelectOption } from "./SelectOption";

export type BaseSelectOption<T, V> = T & {
  readonly value?: V;
  readonly label?: string;
  readonly iconColor?: Color | undefined;
  readonly icon?: icons.BasicIconProp | undefined;
};

export type SelectChangeHandler<T, V> = {
  (value: V, model: T): void;
  (value: null, model: null): void;
};

export interface SelectProps<T, V extends string, O extends BaseSelectOption<T, V> = BaseSelectOption<T, V>>
  extends Omit<RootSelectProps, "data" | "onChange" | "onError" | "itemComponent"> {
  readonly loading?: boolean;
  readonly data: O[];
  readonly datumKeys: (keyof T)[];
  readonly optionComponent?: RootSelectProps["itemComponent"];
  readonly getLabel?: (v: T) => string;
  readonly getValue?: (datum: T) => V;
  readonly onChange: SelectChangeHandler<T, V>;
}

export const Select = <T, V extends string, O extends BaseSelectOption<T, V> = BaseSelectOption<T, V>>({
  loading,
  optionComponent,
  datumKeys,
  data,
  onChange,
  getLabel,
  getValue,
  ...props
}: SelectProps<T, V, O>): JSX.Element => {
  const _data = data.map((datum: O) => ({ value: datum.value || getValue?.(datum) || "", ...datum }));
  return (
    <RootSelect
      clearable
      {...props}
      onChange={(value: V | null) => {
        if (value === null) {
          onChange(null, null);
        } else {
          const optionModel = _data.find(datum => datum.value === value);
          if (!optionModel) {
            throw new Error(`Inconsistent State: Option model could not be found for value '${value}'!`);
          }
          onChange(value, optionModel);
        }
      }}
      data={_data}
      itemComponent={
        optionComponent ||
        createSelectOption<O, V>([...datumKeys, "value", "label", "icon", "iconColor"], datum => (
          <>
            {datum.icon && (
              <Icon size="xs" color={datum.iconColor || "gray.8"} icon={datum.icon} style={{ marginRight: 8 }} />
            )}
            <Text color="gray.8" fontWeight="medium" size="xs">
              {datum.label || getLabel?.(datum) || ""}
            </Text>
          </>
        ))
      }
      className={classNames("select", props.className)}
      rightSection={loading ? <Loader size="xs" color="gray.6" /> : props.rightSection}
      disabled={props.disabled || loading}
      styles={{ rightSection: { display: "flex !important" } }}
    />
  );
};
