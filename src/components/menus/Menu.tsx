import React, { useState } from "react";

import classNames from "classnames";
import { type Required } from "utility-types";

import { type ComponentProps } from "~/lib/ui";
import { type IconProp } from "~/components/icons";

type MenuSelectionMode = "single" | "multiple";

type ValuedMenuItem<V extends string | null, M extends Record<string, unknown>> = {
  readonly label: string;
  readonly icon?: IconProp;
  readonly value: Exclude<V, null>;
  readonly datum: M;
};

type ValuelessMenuItem<M extends Record<string, unknown>> = {
  readonly label: string;
  readonly icon?: IconProp;
  readonly datum: M;
};

type _ValuedDataProps<V extends string | null, M extends Record<string, unknown>> = {
  readonly items: ValuedMenuItem<V, M>[];
  readonly getValue?: never;
};

type _ValuelessDataProps<V extends string | null, M extends Record<string, unknown>> = {
  readonly items: ValuelessMenuItem<M>[];
  readonly getValue: (item: ValuelessMenuItem<M>) => Exclude<V, null>;
};

type MenuValuedProps<V extends string | null, M extends Record<string, unknown>> =
  | _ValuedDataProps<V, M>
  | _ValuelessDataProps<V, M>;

type _MultiMenuNonNullableProps<V extends string | null, M extends Record<string, unknown>> = ComponentProps & {
  readonly mode: "multiple";
  readonly defaultValue?: Exclude<V, null>[];
  readonly clearable?: boolean;
  readonly value?: Exclude<V, null>[];
  readonly onChange?: (value: Exclude<V, null>[], data: M[]) => void;
};

type _SingleMenuNullableProps<V extends string | null, M extends Record<string, unknown>> = {
  readonly mode: "single";
  readonly defaultValue?: V;
  readonly clearable?: boolean;
  readonly value?: V;
  readonly onChange?: (value: V, data: M) => void;
};

type _SingleMenuNonNullableProps<V extends string | null, M extends Record<string, unknown>> = {
  readonly mode: "single";
  readonly defaultValue: Exclude<V, null>;
  readonly clearable?: false;
  readonly value?: Exclude<V, null>;
  readonly onChange?: (value: Exclude<V, null>, data: M) => void;
};

type _MenuModeProps<V extends string | null, M extends Record<string, unknown>> =
  | _MultiMenuNonNullableProps<V, M>
  | _SingleMenuNonNullableProps<V, M>
  | _SingleMenuNullableProps<V, M>;

/* export type MultiMenuProps<V extends string, M extends Record<string, unknown>> = ComponentProps & {
     readonly mode: "multiple";
     readonly value?: V[];
     readonly onChange?: (value: V[], data: M[]) => void;
   } & (ValuedDataProps<V, M> | ValuelessDataProps<V, M>); */

/* export type SingleMenuProps<V extends string, M extends Record<string, unknown>> = ComponentProps & {
     readonly mode?: "single";
     readonly value?: V | null;
     readonly onChange?: (value: V | null, data: M) => void;
   } & (ValuedDataProps<V, M> | ValuelessDataProps<V, M>); */

export type MenuProps<V extends string | null, M extends Record<string, unknown>> = _MenuModeProps<V, M> &
  MenuValuedProps<V, M> &
  ComponentProps;

export const Menu = <V extends string | null, M extends Record<string, unknown>>({
  mode,
  value,
  onChange,
  items,
  defaultValue,
  clearable,
  getValue,
  ...props
}: MenuProps<V, M>): JSX.Element => {
  type Value = Required<MenuProps<V, M>, "value">["value"];

  const [_value, setValue] = useState<Value>(defaultValue === undefined ? (null as V) : defaultValue);
  // const [_multiValue, setMultiValue] = useState<V>()

  return (
    <div {...props} className={classNames("menu", props.className)}>
      <div className="menu__items-container">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <div className="menu-item">{item.label}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
