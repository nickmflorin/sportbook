import { type ReactNode } from "react";

import { type ComponentProps } from "~/lib/ui";

import {
  type DatumValuelessMenuItem,
  type ValuedMenuItem,
  type DatumValuedMenuItem,
  menuItemsAreAllDatumValued,
  menuItemsAreAllValued,
  menuItemsAreAllDatumValueless,
} from "./types";

type CommonMenuProps = ComponentProps & {
  readonly children?: ReactNode;
};

type MultiValuedMixin<V extends string | null> = {
  readonly mode: "multiple";
  readonly defaultValue?: Exclude<V, null>[];
  readonly clearable?: boolean;
  readonly value?: Exclude<V, null>[];
  readonly withCheckbox?: boolean;
};

export type MultiValuedMenuProps<V extends string | null> = CommonMenuProps &
  MultiValuedMixin<V> & {
    readonly items: ValuedMenuItem<V>[];
    readonly getValue?: never;
    readonly onChange?: (value: Exclude<V, null>[]) => void;
  };

export type MultiDatumValuedMenuProps<V extends string | null, M> = CommonMenuProps &
  MultiValuedMixin<V> & {
    readonly items: DatumValuedMenuItem<V, M>[];
    readonly getValue?: never;
    readonly onChange?: (value: Exclude<V, null>[], data: M[]) => void;
  };

export type MultiDatumValuedCallbackMenuProps<V extends string | null, M> = CommonMenuProps &
  MultiValuedMixin<V> & {
    readonly items: DatumValuelessMenuItem<M>[];
    readonly getValue: (item: M) => Exclude<V, null>;
    readonly onChange?: (value: Exclude<V, null>[], data: M[]) => void;
  };

export type MultiMenuProps<V extends string | null, M> =
  | MultiValuedMenuProps<V>
  // | MultiValuedCallbackMenuProps<V>
  | MultiDatumValuedMenuProps<V, M>
  | MultiDatumValuedCallbackMenuProps<V, M>;

type SingleValuedMixin<T extends Exclude<V, null> | V, V extends string | null> = {
  readonly mode: "single";
  readonly value?: T;
  readonly withCheckbox?: boolean;
};

type SingleNullableValuedMixin<V extends string | null> = SingleValuedMixin<Exclude<V, null>, V> & {
  readonly nullable: true;
  readonly clearable?: boolean;
  readonly defaultValue?: V;
};

type SingleNonNullableValuedMixin<V extends string | null> = SingleValuedMixin<Exclude<V, null>, V> & {
  readonly nullable?: never;
  readonly clearable?: never;
  readonly defaultValue: Exclude<V, null>;
};

export type SingleNullableValuedMenuProps<V extends string | null> = CommonMenuProps &
  SingleNullableValuedMixin<V> & {
    readonly items: ValuedMenuItem<V>[];
    readonly getValue?: never;
    readonly onChange?: (value: V | null) => void;
  };

export type SingleNonNullableValuedMenuProps<V extends string | null> = CommonMenuProps &
  SingleNonNullableValuedMixin<V> & {
    readonly items: ValuedMenuItem<V>[];
    readonly getValue?: never;
    readonly onChange?: (value: Exclude<V, null>) => void;
  };

export type SingleDatumNullableValuedMenuProps<V extends string | null, M> = CommonMenuProps &
  SingleNullableValuedMixin<V> & {
    readonly items: DatumValuedMenuItem<V, M>[];
    readonly getValue?: never;
    readonly onChange?: (value: V | null, data: M) => void;
  };

export type SingleDatumNonNullableValuedMenuProps<V extends string | null, M> = CommonMenuProps &
  SingleNonNullableValuedMixin<V> & {
    readonly items: DatumValuedMenuItem<V, M>[];
    readonly getValue?: never;
    readonly onChange?: (value: Exclude<V, null>, data: M[]) => void;
  };

export type SingleDatumValuedNullableCallbackMenuProps<V extends string | null, M> = CommonMenuProps &
  SingleNullableValuedMixin<V> & {
    readonly items: DatumValuelessMenuItem<M>[];
    readonly getValue: (item: M) => Exclude<V, null>;
    readonly onChange?: (value: V | null, data: M | null) => void;
  };

export type SingleDatumNonNullableValuedCallbackMenuProps<V extends string | null, M> = CommonMenuProps &
  SingleNonNullableValuedMixin<V> & {
    readonly items: DatumValuelessMenuItem<M>[];
    readonly getValue: (item: M) => Exclude<V, null>;
    readonly onChange?: (value: Exclude<V, null>, data: M) => void;
  };

// TODO: Do  we need valueless?
export type SingleMenuProps<V extends string | null, M> =
  | SingleNullableValuedMenuProps<V>
  | SingleNonNullableValuedMenuProps<V>
  | SingleDatumNullableValuedMenuProps<V, M>
  | SingleDatumNonNullableValuedCallbackMenuProps<V, M>
  | SingleDatumNonNullableValuedMenuProps<V, M>
  | SingleDatumValuedNullableCallbackMenuProps<V, M>;

export type MenuProps<V extends string | null, M> = SingleMenuProps<V, M> | MultiMenuProps<V, M>;

export function isMultiDatumCallbackValuedMenuProps<V extends string | null, M>(
  props: MenuProps<V, M>,
): props is MultiDatumValuedCallbackMenuProps<V, M> {
  if ((props as MenuProps<V, M>).mode !== "multiple") {
    return false;
  }
  return menuItemsAreAllDatumValueless(props.items);
}

export function isMultiDatumValuedMenuProps<V extends string | null, M>(
  props: MenuProps<V, M>,
): props is MultiDatumValuedMenuProps<V, M> {
  if ((props as MenuProps<V, M>).mode !== "multiple") {
    return false;
  }
  return menuItemsAreAllDatumValued(props.items);
}

export const isMutliValuedMenuProps = <V extends string | null, M>(
  props: Pick<MenuProps<V, M>, "mode" | "items">,
): props is MultiValuedMenuProps<V> => props.mode === "multiple" && menuItemsAreAllValued(props.items);
