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

type SingleValuedMixin<T extends Exclude<V, null> | V, V extends string | null> = {
  readonly mode: "single";
  readonly value?: T;
};

type SingleValuelessMenuProps = {
  readonly mode: "single";
  readonly items: ValuelessMenuItem[];
};

type SingleValuedNullableMixin<V extends string | null> = SingleValuedMixin<V, V> & {
  readonly nullable: true;
  readonly clearable?: boolean;
  readonly defaultValue?: V;
};

type SingleValuedNonNullableMixin<V extends string | null> = SingleValuedMixin<Exclude<V, null>, V> & {
  // The default value is required for non-nullable menus.
  readonly defaultValue: Exclude<V, null>;
};

type SingleValuedNullableMenuProps<V extends string | null> = SingleValuedNullableMixin<V> & {
  readonly items: ValuedMenuItem<V>[];
  readonly onChange?: (value: V | null) => void;
};

type SingleValuedNonNullableMenuProps<V extends string | null> = SingleValuedNonNullableMixin<V> & {
  readonly items: ValuedMenuItem<V>[];
  readonly onChange?: (value: Exclude<V, null>) => void;
};

type SingleDatumValuedNullableMenuProps<V extends string | null, M> = SingleValuedNullableMixin<V> & {
  readonly items: DatumValuedMenuItem<V, M>[];
  readonly onChange?: (value: V | null, data: M) => void;
};

type SingleDatumValuedNonNullableMenuProps<V extends string | null, M> = SingleValuedNonNullableMixin<V> & {
  readonly items: DatumValuedMenuItem<V, M>[];
  readonly onChange?: (value: Exclude<V, null>, data: M) => void;
};

type SingleDatumValuedNullableCallbackMenuProps<V extends string | null, M> = SingleValuedNullableMixin<V> & {
  readonly items: DatumValuelessMenuItem<M>[];
  readonly getValue: DatumValuelessValueGetter<V, M>;
  readonly onChange?: (value: V | null, data: M | null) => void;
};

type SingleDatumValuedNonNullableCallbackMenuProps<V extends string | null, M> = SingleValuedNonNullableMixin<V> & {
  readonly items: DatumValuelessMenuItem<M>[];
  readonly getValue: DatumValuelessValueGetter<V, M>;
  readonly onChange?: (value: Exclude<V, null>, data: M) => void;
};

export type SingleMenuNullableProps<V extends string | null, M> =
  | SingleValuedNullableMenuProps<V>
  | SingleDatumValuedNullableMenuProps<V, M>
  | SingleDatumValuedNullableCallbackMenuProps<V, M>;

export type SingleMenuNonNullableProps<V extends string | null, M> =
  | SingleValuedNonNullableMenuProps<V>
  | SingleDatumValuedNonNullableCallbackMenuProps<V, M>
  | SingleDatumValuedNonNullableMenuProps<V, M>;

export type SingleMenuProps<V extends string | null, M> =
  | SingleMenuNullableProps<V, M>
  | SingleMenuNonNullableProps<V, M>;

type WithPolymorphicProps<P extends SingleMenuProps<V, M>, V extends string | null, M> = Omit<
  P,
  "value" | "defaultValue" | "mode"
> & {
  readonly value: Required<P, "value">["value"];
  readonly onMenuItemClick: (value: Exclude<V, null>, handler: (newState: Exclude<V, null>) => void) => void;
};

const isSingleValuelessProps = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessMenuProps, "mode">,
): props is SingleValuelessMenuProps => menuItemsAreAllValueless(props.items);

const isSingleValuedNonNullableProps = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessMenuProps, "mode">,
): props is SingleValuedNonNullableMenuProps<V> =>
  menuItemsAreAllValued(props.items) && (props as SingleMenuNullableProps<V, M>).nullable !== true;

const isSingleDatumValuedNonNullableProps = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessMenuProps, "mode">,
): props is SingleDatumValuedNonNullableMenuProps<V, M> =>
  menuItemsAreAllDatumValued(props.items) && (props as SingleMenuNullableProps<V, M>).nullable !== true;

const isSingleDatumValuedNonNullableCallbackProps = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessMenuProps, "mode">,
): props is SingleDatumValuedNonNullableCallbackMenuProps<V, M> =>
  menuItemsAreAllDatumValueless(props.items) &&
  (props as SingleMenuNullableProps<V, M>).nullable !== true &&
  (props as SingleDatumValuedNonNullableCallbackMenuProps<V, M>).getValue !== undefined;

export const isSingleNonNullableProps = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessMenuProps, "mode">,
): props is SingleMenuNonNullableProps<V, M> =>
  isSingleDatumValuedNonNullableCallbackProps(props) ||
  isSingleValuedNonNullableProps(props) ||
  isSingleDatumValuedNonNullableProps(props);

const SingleValuelessMenu = ({ items }: Omit<SingleValuelessMenuProps, "mode">): JSX.Element => (
  <React.Fragment>
    {items.map((item, i) => (
      <ValuelessMenuItemRenderer key={i} item={item} />
    ))}
  </React.Fragment>
);

const SingleValuedNonNullableMenu = <V extends string | null>({
  items,
  onMenuItemClick,
  onChange,
  value,
}: WithPolymorphicProps<SingleValuedNonNullableMenuProps<V>, V, never>): JSX.Element => {
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

const SingleDatumValuedNonNullableMenu = <V extends string | null, M>({
  items,
  onMenuItemClick,
  onChange,
  value,
}: WithPolymorphicProps<SingleDatumValuedNonNullableMenuProps<V, M>, V, M>): JSX.Element => {
  const [valueDatumMap, itemsWithValues] = useValueDatumMap<DatumValuedMenuItem<V, M>[], V, M>({ items });

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
              const datum = valueDatumMap[item.value];
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

const SingleDatumValuedNonNullableCallbackMenu = <V extends string | null, M>({
  items,
  onMenuItemClick,
  onChange,
  getValue,
  value,
}: WithPolymorphicProps<SingleDatumValuedNonNullableCallbackMenuProps<V, M>, V, M>): JSX.Element => {
  const [valueDatumMap, itemsWithValues] = useValueDatumMap<DatumValuelessMenuItem<M>[], V, M>({ items, getValue });

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
              const datum = valueDatumMap[item.value];
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

  if (isSingleDatumValuedNonNullableCallbackProps<V, M>(passThrough)) {
    return (
      <SingleDatumValuedNonNullableCallbackMenu<V, M>
        {...passThrough}
        value={value === undefined ? _value : value}
        onMenuItemClick={onMenuItemClick}
      />
    );
  } else if (isSingleDatumValuedNonNullableProps<V, M>(passThrough)) {
    return (
      <SingleDatumValuedNonNullableMenu<V, M>
        {...passThrough}
        value={value === undefined ? _value : value}
        onMenuItemClick={onMenuItemClick}
      />
    );
  } else {
    return (
      <SingleValuedNonNullableMenu<V>
        {...passThrough}
        value={value === undefined ? _value : value}
        onMenuItemClick={onMenuItemClick}
      />
    );
  }
};

export const SingleMenu = <V extends string | null, M>(
  props: Omit<SingleMenuProps<V, M>, "mode"> | Omit<SingleValuelessMenuProps, "mode">,
): JSX.Element => {
  if (isSingleNonNullableProps<V, M>(props)) {
    return <SingleNonNullableMenu {...props} />;
  } else if (isSingleValuelessProps<V, M>(props)) {
    return <SingleValuelessMenu {...props} />;
  } else {
    return <></>;
  }
};
