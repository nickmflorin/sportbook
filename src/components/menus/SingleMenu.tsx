import React, { useState, useEffect, useMemo, useTransition } from "react";

import { type Required } from "utility-types";

import { useValueDatumMap, useItemValues } from "./hooks";
import { ValuedMenuItemRenderer, ValuelessMenuItemRenderer } from "./items";
import {
  type DatumValuelessMenuItem,
  type ValuedMenuItem,
  type DatumValuedMenuItem,
  type DatumValuelessValueGetter,
  type ValuelessMenuItem,
  menuItemsAreAllValued,
  menuItemsAreAllDatumValued,
  menuItemsAreAllDatumValueless,
  menuItemsAreAllValueless,
} from "./types";

type SingleMixin<T extends Exclude<V, null> | V, V extends string | null> = {
  readonly mode: "single";
  readonly value?: T;
};

export type SingleValuelessProps = {
  readonly mode: "single";
  readonly items: ValuelessMenuItem[];
};

type SingleNullableMixin<V extends string | null> = SingleMixin<V, V> & {
  readonly nullable: true;
  readonly clearable?: boolean;
  readonly defaultValue?: V;
};

type SingleNonNullableMixin<V extends string | null> = SingleMixin<Exclude<V, null>, V> & {
  // The default value is required for non-nullable menus.
  readonly defaultValue: Exclude<V, null>;
};

type SingleNullableProps<V extends string | null> = SingleNullableMixin<V> & {
  readonly items: ValuedMenuItem<V>[];
  readonly onChange?: (value: V | null) => void;
};

type SingleNonNullableProps<V extends string | null> = SingleNonNullableMixin<V> & {
  readonly items: ValuedMenuItem<V>[];
  readonly onChange?: (value: Exclude<V, null>) => void;
};

type SingleDatumNullableProps<V extends string | null, M> = SingleNullableMixin<V> & {
  readonly items: DatumValuedMenuItem<V, M>[];
  readonly onChange?: (value: V | null, data: M) => void;
};

type SingleDatumNonNullableProps<V extends string | null, M> = SingleNonNullableMixin<V> & {
  readonly items: DatumValuedMenuItem<V, M>[];
  readonly onChange?: (value: Exclude<V, null>, data: M) => void;
};

type SingleDatumNullableCallbackProps<V extends string | null, M> = SingleNullableMixin<V> & {
  readonly items: DatumValuelessMenuItem<M>[];
  readonly getValue: DatumValuelessValueGetter<V, M>;
  readonly onChange?: (value: V | null, data: M | null) => void;
};

type SingleDatumNonNullableCallbackProps<V extends string | null, M> = SingleNonNullableMixin<V> & {
  readonly items: DatumValuelessMenuItem<M>[];
  readonly getValue: DatumValuelessValueGetter<V, M>;
  readonly onChange?: (value: Exclude<V, null>, data: M) => void;
};

export type SingleMenuNullableProps<V extends string | null, M> =
  | SingleNullableProps<V>
  | SingleDatumNullableProps<V, M>
  | SingleDatumNullableCallbackProps<V, M>;

export type SingleMenuNonNullableProps<V extends string | null, M> =
  | SingleNonNullableProps<V>
  | SingleDatumNonNullableCallbackProps<V, M>
  | SingleDatumNonNullableProps<V, M>;

export type SingleMenuValuedProps<V extends string | null, M> =
  | SingleMenuNullableProps<V, M>
  | SingleMenuNonNullableProps<V, M>;

export type SingleMenuProps<V extends string | null, M> = SingleMenuValuedProps<V, M> | SingleValuelessProps;

type WithPolymorphicProps<P extends SingleMenuValuedProps<V, M>, V extends string | null, M> = Omit<
  P,
  "value" | "defaultValue" | "mode"
> & {
  readonly value: Required<P, "value">["value"];
  readonly onMenuItemClick: (value: Exclude<V, null>, handler: (newState: Exclude<V, null>) => void) => void;
};

const isSingleValuelessProps = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessProps, "mode">,
): props is SingleValuelessProps => menuItemsAreAllValueless(props.items);

const isSingleNonNullableProps = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessProps, "mode">,
): props is SingleNonNullableProps<V> =>
  menuItemsAreAllValued(props.items) && (props as SingleMenuNullableProps<V, M>).nullable !== true;

const isSingleDatumNonNullableProps = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessProps, "mode">,
): props is SingleDatumNonNullableProps<V, M> =>
  menuItemsAreAllDatumValued(props.items) && (props as SingleMenuNullableProps<V, M>).nullable !== true;

const isSingleDatumNonNullableCallbackProps = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessProps, "mode">,
): props is SingleDatumNonNullableCallbackProps<V, M> =>
  menuItemsAreAllDatumValueless(props.items) &&
  (props as SingleMenuNullableProps<V, M>).nullable !== true &&
  (props as SingleDatumNonNullableCallbackProps<V, M>).getValue !== undefined;

export const isSingleMenuNonNullableProps = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessProps, "mode">,
): props is SingleMenuNonNullableProps<V, M> =>
  isSingleDatumNonNullableCallbackProps(props) ||
  isSingleNonNullableProps(props) ||
  isSingleDatumNonNullableProps(props);

const SingleValuelessMenu = ({ items }: Omit<SingleValuelessProps, "mode">): JSX.Element => (
  <React.Fragment>
    {items.map((item, i) => (
      <ValuelessMenuItemRenderer key={i} item={item} />
    ))}
  </React.Fragment>
);

const _SingleNonNullableMenu = <V extends string | null>({
  items,
  onMenuItemClick,
  onChange,
  value,
}: WithPolymorphicProps<SingleNonNullableProps<V>, V, never>): JSX.Element => {
  const itemsWithValues = useItemValues<ValuedMenuItem<V>[], V, never>({ items });

  return (
    <React.Fragment>
      {itemsWithValues.map((item, i) => (
        <ValuedMenuItemRenderer
          key={i}
          item={item}
          selected={value === item.value}
          withCheckbox={false}
          onClick={() => onMenuItemClick(item.value, newState => onChange?.(newState))}
        />
      ))}
    </React.Fragment>
  );
};

const _SingleDatumNonNullableMenu = <V extends string | null, M>({
  items,
  onMenuItemClick,
  onChange,
  value,
}: WithPolymorphicProps<SingleDatumNonNullableProps<V, M>, V, M>): JSX.Element => {
  const [atumMap, itemsWithValues] = useValueDatumMap<DatumValuedMenuItem<V, M>[], V, M>({ items });

  return (
    <React.Fragment>
      {itemsWithValues.map((item, i) => (
        <ValuedMenuItemRenderer
          key={i}
          item={item}
          selected={value === item.value}
          withCheckbox={false}
          onClick={() => {
            onMenuItemClick(item.value, newState => {
              const datum = atumMap[item.value];
              if (datum === undefined) {
                throw new Error(`No datum was found for menu item with value '${item.value}'.`);
              }
              onChange?.(newState, datum);
            });
          }}
        />
      ))}
    </React.Fragment>
  );
};

const _SingleDatumNonNullableCallbackMenu = <V extends string | null, M>({
  items,
  onMenuItemClick,
  onChange,
  getValue,
  value,
}: WithPolymorphicProps<SingleDatumNonNullableCallbackProps<V, M>, V, M>): JSX.Element => {
  const [atumMap, itemsWithValues] = useValueDatumMap<DatumValuelessMenuItem<M>[], V, M>({ items, getValue });

  return (
    <React.Fragment>
      {itemsWithValues.map((item, i) => (
        <ValuedMenuItemRenderer
          key={i}
          item={item}
          selected={value === item.value}
          withCheckbox={false}
          onClick={() => {
            onMenuItemClick(item.value, newState => {
              const datum = atumMap[item.value];
              if (datum === undefined) {
                throw new Error(`No datum was found for menu item with value '${item.value}'.`);
              }
              onChange?.(newState, datum);
            });
          }}
        />
      ))}
    </React.Fragment>
  );
};

export const SingleNonNullableMenu = <V extends string | null, M>({
  defaultValue,
  value,
  ...props
}: Omit<SingleMenuNonNullableProps<V, M>, "mode">): JSX.Element => {
  const [_value, setValue] = useState<Exclude<V, null>>(defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setValue(value);
    }
  }, [value]);

  const passThrough = { ...props, mode: "single" } as SingleMenuNonNullableProps<V, M>;
  const [_, startTransition] = useTransition();

  const onMenuItemClick = useMemo(
    () => (clickedValue: Exclude<V, null>, handler: (newState: Exclude<V, null>) => void) => {
      startTransition(() => setValue(clickedValue));
      handler(clickedValue);
    },
    [],
  );

  if (isSingleDatumNonNullableCallbackProps<V, M>(passThrough)) {
    return (
      <_SingleDatumNonNullableCallbackMenu<V, M>
        {...passThrough}
        value={value === undefined ? _value : value}
        onMenuItemClick={onMenuItemClick}
      />
    );
  } else if (isSingleDatumNonNullableProps<V, M>(passThrough)) {
    return (
      <_SingleDatumNonNullableMenu<V, M>
        {...passThrough}
        value={value === undefined ? _value : value}
        onMenuItemClick={onMenuItemClick}
      />
    );
  } else {
    return (
      <_SingleNonNullableMenu<V>
        {...passThrough}
        value={value === undefined ? _value : value}
        onMenuItemClick={onMenuItemClick}
      />
    );
  }
};

export const SingleMenu = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessProps, "mode">,
): JSX.Element => {
  if (isSingleNonNullableProps<V, M>(props)) {
    return <SingleNonNullableMenu {...props} />;
  } else if (isSingleValuelessProps<V, M>(props)) {
    return <SingleValuelessMenu {...props} />;
  } else {
    return <></>;
  }
};
