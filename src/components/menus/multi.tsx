"use client";
import React, { useMemo, useState } from "react";

import uniq from "lodash.uniq";

import type * as types from "./types";

import { ValuedMenuItem } from "./items";
import {
  type MultiMenuProps,
  type MultiDatumValuedMenuProps,
  type MultiValuedMenuProps,
  type MultiDatumValuedCallbackMenuProps,
  isMultiDatumValuedMenuProps,
  isMultiDatumCallbackValuedMenuProps,
} from "./props";

type WithPolymorphicProps<P extends MultiMenuProps<V, M>, V extends string | null, M> = Omit<
  P,
  "value" | "defaultValue" | "mode"
> & {
  readonly value: Exclude<P["value"], undefined>;
  readonly onMenuItemClick: (value: Exclude<V, null>, handler: (newState: Exclude<V, null>[]) => void) => void;
};

export const MultiMenu = <V extends string | null, M>({
  defaultValue,
  value,
  ...props
}: Omit<MultiMenuProps<V, M>, "mode">): JSX.Element => {
  const [_value, setValue] = useState<Exclude<V, null>[]>(
    defaultValue === undefined ? ([] as Exclude<V, null>[]) : defaultValue,
  );

  const passThrough = { ...props, mode: "multiple" } as MultiMenuProps<V, M>;

  const onMenuItemClick = useMemo(
    () => (value: Exclude<V, null>, handler: (newState: Exclude<V, null>[]) => void) => {
      setValue(prev => {
        let newState: Exclude<V, null>[];
        if (prev.includes(value)) {
          newState = prev.filter(v => v !== value);
        } else {
          newState = [...prev, value];
        }
        handler(newState);
        return newState;
      });
    },
    [],
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
      <MultiValuedMenu<V>
        {...passThrough}
        value={value === undefined ? _value : value}
        onMenuItemClick={onMenuItemClick}
      />
    );
  }
};

const MultiValuedMenu = <V extends string | null>({
  items,
  withCheckbox,
  onChange,
  value,
  onMenuItemClick,
  clearable,
}: Omit<WithPolymorphicProps<MultiValuedMenuProps<V>, V, never>, "getValue" | "defaultValue">): JSX.Element => {
  if (uniq(items.map(i => i.value)).length !== items.length) {
    throw new Error("Detected duplicate values for menu items.  Values must be unique!");
  }

  return (
    <React.Fragment>
      {items.map((item, i) => (
        <ValuedMenuItem
          key={i}
          {...item}
          withCheckbox={withCheckbox}
          onClick={() => onMenuItemClick(item.value, newState => onChange?.(newState))}
          selected={value.includes(item.value)}
        />
      ))}
    </React.Fragment>
  );
};

type ValueDatumMap<V extends string | null, M> = { [key in Exclude<V, null>]: M };

const MultiDatumValuedMenu = <V extends string | null, M>({
  items,
  withCheckbox,
  onMenuItemClick,
  onChange,
  value,
  clearable,
}: Omit<WithPolymorphicProps<MultiDatumValuedMenuProps<V, M>, V, M>, "getValue">): JSX.Element => {
  const valueDatumMap = useMemo<ValueDatumMap<V, M>>(() => {
    let seenValues: Exclude<V, null>[] = [];
    return items.reduce(
      (prev: ValueDatumMap<V, M>, item: types.DatumValuedMenuItem<V, M>) => {
        if (seenValues.includes(item.value)) {
          throw new Error(`Detected duplicate value '${item.value}' for menu items.  Values must be unique!`);
        }
        seenValues = [...seenValues, item.value];
        return { ...prev, [item.value]: item.datum };
      },
      {} as ValueDatumMap<V, M>,
    );
  }, [items]);

  return (
    <React.Fragment>
      {items.map((item, i) => (
        <ValuedMenuItem
          key={i}
          {...item}
          withCheckbox={withCheckbox}
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
          selected={value.includes(item.value)}
        />
      ))}
    </React.Fragment>
  );
};

type ValuelessItemWithValue<V extends string | null, M> = Omit<types.DatumValuelessMenuItem<M>, "value"> & {
  readonly value: Exclude<V, null>;
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
  const [valueDatumMap, itemsWithValues] = useMemo<[ValueDatumMap<V, M>, ValuelessItemWithValue<V, M>[]]>(() => {
    let itemsWithValues: ValuelessItemWithValue<V, M>[] = [];
    const mapping = items.reduce(
      (prev: ValueDatumMap<V, M>, item: types.DatumValuelessMenuItem<M>) => {
        const value = getValue(item.datum);
        if (itemsWithValues.map(i => i.value).includes(value)) {
          throw new Error(`Detected duplicate value '${value}' for menu items.  Values must be unique!`);
        }
        itemsWithValues = [...itemsWithValues, { ...item, value }];
        return { ...prev, [value]: item.datum };
      },
      {} as ValueDatumMap<V, M>,
    );
    return [mapping, itemsWithValues];
  }, [items, getValue]);

  return (
    <React.Fragment>
      {itemsWithValues.map((item, i) => (
        <ValuedMenuItem
          key={i}
          {...item}
          withCheckbox={withCheckbox}
          onClick={() => {
            item.onClick?.();
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
          selected={value.includes(item.value)}
        />
      ))}
    </React.Fragment>
  );
};
