"use client";
import React, { useMemo, useState, useTransition, useImperativeHandle, useEffect } from "react";

import { BaseMenu } from "./BaseMenu";
import { useValueDatumMap, useItemValues } from "./hooks";
import { ValuedMenuItemRenderer } from "./items";
import {
  type ValuedMenuItem,
  type MultiMenuProps,
  isMultiDatumValuedMenuProps,
  DatumValuedMenuItems,
  AnyValuedMenuItems,
} from "./types";

type ChildMenuProps<V extends string | null, M, I extends AnyValuedMenuItems<V, M>> = Omit<
  MultiMenuProps<V, M, I>,
  "id" | "defaultValue" | "value" | "footerActions" | "className" | "style" | "shortcuts"
> & {
  readonly value: Exclude<MultiMenuProps<V, M, I>["value"], undefined>;
  readonly setValue: (
    value: Exclude<V, null> | Exclude<V, null>[],
    handler: (newState: Exclude<V, null>[]) => void,
  ) => void;
};

const MultiValuedMenu = <V extends string | null>(
  props: ChildMenuProps<V, never, ValuedMenuItem<V>[]>,
): JSX.Element => {
  const valuedItems = useItemValues({
    items: props.items,
  });

  const { setValue: _setValue, onChange, value, menu, withCheckbox } = props;

  const setValue = useMemo(
    () => (v: Exclude<V, null> | Exclude<V, null>[]) => _setValue(v, newState => onChange?.(newState)),
    [_setValue, onChange],
  );

  useImperativeHandle(menu, () => ({
    setValue: (v: Exclude<V, null>[]) => setValue(v),
    clear: () => setValue([]),
  }));

  return (
    <React.Fragment>
      {valuedItems.map((item, i) => (
        <ValuedMenuItemRenderer
          key={i}
          item={item}
          withCheckbox={withCheckbox}
          onClick={() => setValue(item.value)}
          selected={value.includes(item.value)}
        />
      ))}
    </React.Fragment>
  );
};

const MultiDatumValuedMenu = <V extends string | null, M>({
  items,
  withCheckbox,
  setValue: _setValue,
  onChange,
  value,
  menu,
}: ChildMenuProps<V, M, DatumValuedMenuItems<V, M>>): JSX.Element => {
  const [valueDatumMap] = useValueDatumMap<DatumValuedMenuItems<V, M>, V, M>({ items });

  const setValue = useMemo(
    () => (v: Exclude<V, null> | Exclude<V, null>[]) =>
      _setValue(
        v,
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
      ),
    [valueDatumMap, _setValue, onChange],
  );

  useImperativeHandle(menu, () => ({
    setValue: (v: Exclude<V, null>[]) => setValue(v),
    clear: () => setValue([]),
  }));

  return (
    <React.Fragment>
      {items.map((item, i) => (
        <ValuedMenuItemRenderer
          key={i}
          item={item}
          withCheckbox={withCheckbox}
          selected={value.includes(item.value)}
          onClick={() => setValue(item.value)}
        />
      ))}
    </React.Fragment>
  );
};

export const MultiMenu = <V extends string | null, M>(props: MultiMenuProps<V, M>): JSX.Element => {
  const { id, defaultValue, value, footerActions, className, style, shortcuts, ...rest } = props;
  const [_, startTransition] = useTransition();
  const [_value, _setValue] = useState<Exclude<V, null>[]>(
    defaultValue === undefined ? ([] as Exclude<V, null>[]) : defaultValue,
  );

  useEffect(() => {
    if (value !== undefined) {
      _setValue(value);
    }
  }, [value]);

  const setValue = useMemo(
    () => (val: Exclude<V, null> | Exclude<V, null>[], handler: (newState: Exclude<V, null>[]) => void) => {
      let newState: Exclude<V, null>[];
      if (Array.isArray(val)) {
        newState = val;
      } else if (_value.includes(val)) {
        newState = _value.filter(v => v !== val);
      } else {
        newState = [..._value, val];
      }
      startTransition(() => _setValue(newState));
      handler(newState);
    },
    [_value],
  );

  return (
    <BaseMenu
      id={id}
      footerActions={footerActions}
      className={className}
      style={style}
      shortcuts={shortcuts}
      footerActionParams={{ value: value === undefined ? _value : value }}
    >
      {isMultiDatumValuedMenuProps<V, M>(props) ? (
        <MultiDatumValuedMenu<V, M> {...props} value={value === undefined ? _value : value} setValue={setValue} />
      ) : (
        <MultiValuedMenu<V> {...props} value={value === undefined ? _value : value} setValue={setValue} />
      )}
    </BaseMenu>
  );
};

export type MultiMenuType = {
  <V extends string | null, M>(props: MultiMenuProps<V, M>): JSX.Element;
};

export default MultiMenu;
