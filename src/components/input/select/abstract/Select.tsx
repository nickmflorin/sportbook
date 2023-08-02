import { useCallback } from "react";

import {
  Select as RootSingleSelect,
  MultiSelect as RootMultiSelect,
  type SelectProps as _RootSingleSelectProps,
  type MultiSelectProps as _RootMultiSelectProps,
} from "@mantine/core";
import classNames from "classnames";

import { type Color, type ClassName, type Style } from "~/lib/ui";
import { type BasicIconProp } from "~/components/icons";
import { Spinner, Icon } from "~/components/icons/Icon";
import { Label } from "~/components/typography/Label";
import { Text } from "~/components/typography/Text";

import { createSelectOption } from "./SelectOption";

export type BaseSelectOption<T, V> = T & {
  readonly value?: V;
  readonly label?: string;
  readonly iconColor?: Color | undefined;
  readonly icon?: BasicIconProp | undefined;
};

type _SelectChangeHandlerValue<V extends string | null, M extends SelectMode> = M extends "multiple"
  ? NonNullable<V>[]
  : V | null;

type _SelectChangeHandlerParams<T, V extends string | null, M extends SelectMode> = M extends "single"
  ? { value: V; model: V extends null ? T | null : T }
  : { value: NonNullable<V>; model: T }[];

export type SelectMode = "single" | "multiple";

type _RootSelectProps<M extends SelectMode> = {
  single: _RootSingleSelectProps;
  multiple: _RootMultiSelectProps;
}[M];

export type SelectChangeHandler<T, V extends string | null, M extends SelectMode = SelectMode> = (
  value: _SelectChangeHandlerValue<V, M>,
  params: _SelectChangeHandlerParams<T, V, M>,
) => void;

export type SelectProps<
  T,
  V extends string | null,
  M extends SelectMode,
  O extends BaseSelectOption<T, V> = BaseSelectOption<T, V>,
> = {
  readonly className?: ClassName;
  readonly style?: Style;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly clearable?: boolean;
  readonly mode: M;
  readonly loading?: boolean;
  readonly data: O[];
  readonly withCheckbox?: boolean;
  readonly datumKeys: (keyof T)[];
  readonly optionComponent?: _RootSelectProps<M>["itemComponent"];
  readonly creatable?: _RootSelectProps<M>["creatable"];
  readonly searchable?: _RootSelectProps<M>["searchable"];
  readonly shouldCreate?: _RootSelectProps<M>["shouldCreate"];
  readonly getCreateLabel?: (query: string) => string;
  // Overridden to just return void so that it is just a click handler.
  readonly onCreate?: (query: string) => void;
  readonly onChange: SelectChangeHandler<T, V, M>;
  readonly getLabel?: (v: T) => string;
  readonly getValue?: (datum: T) => V;
};

export const useSelectProps = <
  T,
  V extends string | null,
  M extends SelectMode,
  O extends BaseSelectOption<T, V> = BaseSelectOption<T, V>,
>({
  mode,
  data,
  loading,
  optionComponent,
  datumKeys,
  withCheckbox,
  getValue,
  getLabel,
  getCreateLabel,
  ...props
}: Omit<SelectProps<T, V, M, O>, "onChange">): [_RootSelectProps<M>, (v: NonNullable<V>) => T] => {
  const _data = data.map((datum: O) => ({
    value: datum.value || getValue?.(datum) || "",
    label: datum.label || getLabel?.(datum) || "",
    ...datum,
  }));
  const getOptionModel = useCallback(
    (value: NonNullable<V>): T => {
      const optionModel = _data.find(datum => datum.value === value);
      if (!optionModel) {
        throw new Error(`Inconsistent State: Option model could not be found for value '${value}'!`);
      }
      return optionModel;
    },
    [_data],
  );

  const originalProps: _RootSelectProps<M> = {
    clearable: true,
    ...props,
    onCreate: (...args) => {
      props.onCreate?.(...args);
      // Return null so that the select does not treat the creatable section as an option.
      return null;
    },
    getCreateLabel: (query: string) => (
      <div className="select-option-createable">
        <Icon name="plus-circle" />
        <Label>{getCreateLabel?.(query) || "Create"}</Label>
      </div>
    ),
    className: classNames("select", props.className),
    // TODO: Use FontAwesome spinner and style in SASS.
    rightSection: loading ? <Spinner loading={true} size="xs" color="gray.6" /> : undefined,
    disabled: props.disabled || loading,
    styles: { rightSection: { display: "flex !important" } },
    data: _data,
    itemComponent:
      optionComponent ||
      createSelectOption<O, V>(
        [...datumKeys, "value", "label", "icon", "iconColor"],
        datum => (
          <>
            {datum.icon && (
              <Icon size="xs" color={datum.iconColor || "gray.8"} icon={datum.icon} style={{ marginRight: 8 }} />
            )}
            <Text color="gray.8" fontWeight="medium" size="xs">
              {datum.label}
            </Text>
          </>
        ),
        { withCheckbox: withCheckbox === undefined ? mode === "multiple" : withCheckbox },
      ),
  };

  return [originalProps, getOptionModel];
};

export const Select = <
  T,
  V extends string | null,
  M extends SelectMode,
  O extends BaseSelectOption<T, V> = BaseSelectOption<T, V>,
>({
  onChange,
  ...props
}: SelectProps<T, V, M, O>): JSX.Element => {
  const [original, getOptionModel] = useSelectProps<T, V, M, O>(props);

  if (props.mode === "multiple") {
    return (
      <RootMultiSelect
        {...(original as _RootSelectProps<"multiple">)}
        onChange={(values: string[]) => {
          const fn = onChange as SelectChangeHandler<T, V, "multiple">;
          return fn(
            values as NonNullable<V>[],
            (values as NonNullable<V>[]).map(v => ({ value: v, model: getOptionModel(v) })),
          );
        }}
      />
    );
  }
  return (
    <RootSingleSelect
      {...(original as _RootSelectProps<"single">)}
      onChange={(value: V) => {
        const fn = onChange as SelectChangeHandler<T, V, "single">;
        return fn(value, { value, model: (value ? getOptionModel(value) : null) as V extends null ? T | null : T });
      }}
    />
  );
};
