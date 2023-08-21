"use client";
import React, { useMemo, useState, useTransition, useRef, useImperativeHandle, useEffect } from "react";

import { BaseMenu, type BaseMenuProps, type WithBaseMenuProps } from "./BaseMenu";
import { useValueDatumMap, useItemValues } from "./hooks";
import { ValuedMenuItemRenderer } from "./items";
import {
  type DatumValuelessMenuItem,
  type ValuedMenuItem,
  type ValuelessMenuItem,
  type DatumValuedMenuItem,
  type ValuelessValueGetter,
  type DatumValuelessValueGetter,
  type FooterActions,
  menuItemsAreAllDatumValued,
  menuItemsAreAllDatumValueless,
} from "./types";

export type IMultiMenu<V extends string | null> = {
  readonly setValue: (value: Exclude<V, null>[]) => void;
  readonly clear: () => void;
};

export const useMultiMenu = <V extends string | null>() => {
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  const ref = useRef<IMultiMenu<V>>({ setValue: () => {}, clear: () => {} });
  return ref;
};

type MultiValuedMixin<V extends string | null> = {
  readonly menu?: React.RefObject<IMultiMenu<V>>;
  readonly defaultValue?: Exclude<V, null>[];
  readonly value?: Exclude<V, null>[];
  readonly withCheckbox?: boolean;
  readonly footerActions?: FooterActions<{ value: Exclude<V, null>[] }>;
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

type _MultiMenuProps<V extends string | null, M> =
  | MultiValuedMenuProps<V>
  | MultiValuedCallbackMenuProps<V>
  | MultiDatumValuedMenuProps<V, M>
  | MultiDatumValuedCallbackMenuProps<V, M>;

export type MultiMenuProps<V extends string | null, M> = WithBaseMenuProps<
  _MultiMenuProps<V, M>,
  { value: Exclude<V, null>[] }
>;

const isMultiDatumCallbackValuedMenuProps = <V extends string | null, M>(
  props: _MultiMenuProps<V, M>,
): props is MultiDatumValuedCallbackMenuProps<V, M> => menuItemsAreAllDatumValueless(props.items);

const isMultiDatumValuedMenuProps = <V extends string | null, M>(
  props: _MultiMenuProps<V, M>,
): props is MultiDatumValuedMenuProps<V, M> => menuItemsAreAllDatumValued(props.items);

type WithPolymorphicProps<P extends _MultiMenuProps<V, M>, V extends string | null, M> = Omit<
  P,
  "value" | "defaultValue" | keyof BaseMenuProps<{ value: Exclude<V, null>[] }>
> & {
  readonly value: Exclude<P["value"], undefined>;
  readonly setValue: (
    value: Exclude<V, null> | Exclude<V, null>[],
    handler: (newState: Exclude<V, null>[]) => void,
  ) => void;
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
}: WithPolymorphicProps<MultiDatumValuedMenuProps<V, M>, V, M>): JSX.Element => {
  const [valueDatumMap] = useValueDatumMap<DatumValuedMenuItem<V, M>[], V, M>({ items });

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

const MultiDatumCallbackValuedMenu = <V extends string | null, M>({
  items,
  withCheckbox,
  onChange,
  value,
  getValue,
  setValue: _setValue,
  menu,
}: WithPolymorphicProps<MultiDatumValuedCallbackMenuProps<V, M>, V, M>): JSX.Element => {
  const [valueDatumMap, itemsWithValues] = useValueDatumMap<DatumValuelessMenuItem<M>[], V, M>({ items, getValue });

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
      {itemsWithValues.map((item, i) => (
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

export const MultiMenu = <V extends string | null, M>({
  defaultValue,
  value,
  footerActions,
  className,
  style,
  shortcuts,
  ...props
}: MultiMenuProps<V, M>): JSX.Element => {
  const [_value, _setValue] = useState<Exclude<V, null>[]>(
    defaultValue === undefined ? ([] as Exclude<V, null>[]) : defaultValue,
  );

  useEffect(() => {
    if (value !== undefined) {
      _setValue(value);
    }
  }, [value]);

  const passThrough = props as _MultiMenuProps<V, M>;
  const [_, startTransition] = useTransition();

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
      footerActions={footerActions}
      className={className}
      style={style}
      shortcuts={shortcuts}
      footerActionParams={{ value: value === undefined ? _value : value }}
    >
      {isMultiDatumValuedMenuProps<V, M>(passThrough) ? (
        <MultiDatumValuedMenu<V, M> {...passThrough} value={value === undefined ? _value : value} setValue={setValue} />
      ) : isMultiDatumCallbackValuedMenuProps<V, M>(passThrough) ? (
        <MultiDatumCallbackValuedMenu<V, M>
          {...passThrough}
          value={value === undefined ? _value : value}
          setValue={setValue}
        />
      ) : (
        <MultiDatumlessMenu<V> {...passThrough} value={value === undefined ? _value : value} setValue={setValue} />
      )}
    </BaseMenu>
  );
};

export type MultiMenuType = {
  <V extends string | null, M>(props: MultiMenuProps<V, M>): JSX.Element;
};

export default MultiMenu;
