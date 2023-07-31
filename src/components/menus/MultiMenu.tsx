"use client";
import React, { useMemo, useState, useEffect, useTransition } from "react";

import { useValueDatumMap, useItemValues } from "./hooks";
import { ValuedMenuItemRenderer } from "./items";
import {
  type DatumValuelessMenuItem,
  type ValuedMenuItem,
  type ValuelessMenuItem,
  type DatumValuedMenuItem,
  type ValuelessValueGetter,
  type DatumValuelessValueGetter,
  menuItemsAreAllDatumValued,
  menuItemsAreAllDatumValueless,
} from "./types";

type MultiValuedMixin<V extends string | null> = {
  readonly mode: "multiple";
  readonly defaultValue?: Exclude<V, null>[];
  readonly clearable?: boolean;
  readonly value?: Exclude<V, null>[];
  readonly withCheckbox?: boolean;
};

export type MultiValuedMenuProps<V extends string | null> = MultiValuedMixin<V> & {
  readonly items: ValuedMenuItem<V>[];
  readonly onChange?: (value: Exclude<V, null>[]) => void;
};

export type MultiValuedCallbackMenuProps<V extends string | null> = MultiValuedMixin<V> & {
  readonly items: ValuelessMenuItem[];
  readonly getValue: ValuelessValueGetter<V>;
  readonly onChange?: (value: Exclude<V, null>[]) => void;
};

export type MultiDatumValuedMenuProps<V extends string | null, M> = MultiValuedMixin<V> & {
  readonly items: DatumValuedMenuItem<V, M>[];
  readonly onChange?: (value: Exclude<V, null>[], data: M[]) => void;
};

export type MultiDatumValuedCallbackMenuProps<V extends string | null, M> = MultiValuedMixin<V> & {
  readonly items: DatumValuelessMenuItem<M>[];
  readonly getValue: DatumValuelessValueGetter<V, M>;
  readonly onChange?: (value: Exclude<V, null>[], data: M[]) => void;
};

export type MultiMenuProps<V extends string | null, M> =
  | MultiValuedMenuProps<V>
  | MultiValuedCallbackMenuProps<V>
  | MultiDatumValuedMenuProps<V, M>
  | MultiDatumValuedCallbackMenuProps<V, M>;

const isMultiDatumCallbackValuedMenuProps = <V extends string | null, M>(
  props: MultiMenuProps<V, M>,
): props is MultiDatumValuedCallbackMenuProps<V, M> => menuItemsAreAllDatumValueless(props.items);

const isMultiDatumValuedMenuProps = <V extends string | null, M>(
  props: MultiMenuProps<V, M>,
): props is MultiDatumValuedMenuProps<V, M> => menuItemsAreAllDatumValued(props.items);

type WithPolymorphicProps<P extends MultiMenuProps<V, M>, V extends string | null, M> = Omit<
  P,
  "value" | "defaultValue" | "mode"
> & {
  readonly value: Exclude<P["value"], undefined>;
  readonly onMenuItemClick: (value: Exclude<V, null>, handler: (newState: Exclude<V, null>[]) => void) => void;
};

const MultiDatumlessMenu = <V extends string | null>(
  props:
    | WithPolymorphicProps<MultiValuedMenuProps<V>, V, never>
    | WithPolymorphicProps<MultiValuedCallbackMenuProps<V>, V, never>,
): JSX.Element => {
  const valuedItems = useItemValues({
    items: props.items,
    getValue: (props as WithPolymorphicProps<MultiValuedCallbackMenuProps<V>, V, never>).getValue,
  });

  return (
    <React.Fragment>
      {valuedItems.map((item, i) => (
        <ValuedMenuItemRenderer
          key={i}
          item={item}
          withCheckbox={props.withCheckbox}
          onClick={() => props.onMenuItemClick(item.value, newState => props.onChange?.(newState))}
          selected={props.value.includes(item.value)}
        />
      ))}
    </React.Fragment>
  );
};

const MultiDatumValuedMenu = <V extends string | null, M>({
  items,
  withCheckbox,
  onMenuItemClick,
  onChange,
  value,
  clearable,
}: WithPolymorphicProps<MultiDatumValuedMenuProps<V, M>, V, M>): JSX.Element => {
  const [valueDatumMap] = useValueDatumMap<DatumValuedMenuItem<V, M>[], V, M>({ items });

  return (
    <React.Fragment>
      {items.map((item, i) => (
        <ValuedMenuItemRenderer
          key={i}
          item={item}
          withCheckbox={withCheckbox}
          selected={value.includes(item.value)}
          onClick={() => {
            onMenuItemClick(
              item.value,
              newState =>
                onChange?.(
                  newState,
                  newState.map(v => {
                    const datum = valueDatumMap[v];
                    if (datum === undefined) {
                      throw new Error(`No datum was found for menu item with value '${v}'.`);
                    }
                    return datum;
                  }),
                ),
            );
          }}
        />
      ))}
    </React.Fragment>
  );
};

const MultiDatumCallbackValuedMenu = <V extends string | null, M>({
  items,
  withCheckbox,
  onChange,
  onMenuItemClick,
  value,
  getValue,
  clearable,
}: WithPolymorphicProps<MultiDatumValuedCallbackMenuProps<V, M>, V, M>): JSX.Element => {
  const [valueDatumMap, itemsWithValues] = useValueDatumMap<DatumValuelessMenuItem<M>[], V, M>({ items, getValue });
  return (
    <React.Fragment>
      {itemsWithValues.map((item, i) => (
        <ValuedMenuItemRenderer
          key={i}
          item={item}
          withCheckbox={withCheckbox}
          selected={value.includes(item.value)}
          onClick={() =>
            onMenuItemClick(
              item.value,
              newState =>
                onChange?.(
                  newState,
                  newState.map(v => {
                    const datum = valueDatumMap[v];
                    if (datum === undefined) {
                      throw new Error(`No datum was found for menu item with value '${v}'.`);
                    }
                    return datum;
                  }),
                ),
            )
          }
        />
      ))}
    </React.Fragment>
  );
};

export const MultiMenu = <V extends string | null, M>({
  defaultValue,
  value,
  ...props
}: Omit<MultiMenuProps<V, M>, "mode">): JSX.Element => {
  const [_value, setValue] = useState<Exclude<V, null>[]>(
    defaultValue === undefined ? ([] as Exclude<V, null>[]) : defaultValue,
  );

  useEffect(() => {
    if (value !== undefined) {
      setValue(value);
    }
  }, [value]);

  const passThrough = { ...props, mode: "multiple" } as MultiMenuProps<V, M>;
  const [_, startTransition] = useTransition();

  const onMenuItemClick = useMemo(
    () => (clickedValue: Exclude<V, null>, handler: (newState: Exclude<V, null>[]) => void) => {
      let newState: Exclude<V, null>[];
      if (_value.includes(clickedValue)) {
        newState = _value.filter(v => v !== clickedValue);
      } else {
        newState = [..._value, clickedValue];
      }
      startTransition(() => setValue(newState));
      handler(newState);
    },
    [_value],
  );

  if (isMultiDatumValuedMenuProps<V, M>(passThrough)) {
    return (
      <MultiDatumValuedMenu<V, M>
        {...passThrough}
        value={value === undefined ? _value : value}
        onMenuItemClick={onMenuItemClick}
      />
    );
  } else if (isMultiDatumCallbackValuedMenuProps<V, M>(passThrough)) {
    return (
      <MultiDatumCallbackValuedMenu<V, M>
        {...passThrough}
        value={value === undefined ? _value : value}
        onMenuItemClick={onMenuItemClick}
      />
    );
  } else {
    return (
      <MultiDatumlessMenu<V>
        {...passThrough}
        value={value === undefined ? _value : value}
        onMenuItemClick={onMenuItemClick}
      />
    );
  }
};
