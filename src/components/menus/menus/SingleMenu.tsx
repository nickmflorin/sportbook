"use client";
import React, { useState, useEffect, useMemo, useTransition } from "react";

import { BaseMenu } from "./BaseMenu";
import { useValueDatumMap, useItemValues } from "./hooks";
import { ValuedMenuItemRenderer, ValuelessMenuItemRenderer } from "./items";
import {
  type ValuedMenuItem,
  type SingleValuedMenuProps,
  type SingleMenuValue,
  type AnyValuedMenuItems,
  type ValuedMenuItems,
  isSingleMenuDatumValuedProps,
  isSingleMenuValuelessProps,
  type DatumValuedMenuItems,
  isSingleMenuAnyValuedProps,
  isSingleMenuValuedProps,
  type SingleValuelessMenuProps,
} from "./types";

type ChildMenuProps<V extends string | null, M, N extends boolean, I extends AnyValuedMenuItems<V, M>> = Omit<
  SingleValuedMenuProps<V, M, N, I>,
  "id" | "defaultValue" | "footerActions" | "className" | "style" | "shortcuts"
> & {
  readonly onMenuItemClick: (value: SingleMenuValue<V, N>, handler: (newState: SingleMenuValue<V, N>) => void) => void;
};

const _SingleDatumValuedMenuItems = <V extends string | null, M, N extends boolean>({
  items,
  onMenuItemClick,
  onChange,
  value,
}: ChildMenuProps<V, M, N, DatumValuedMenuItems<V, M>>): JSX.Element => {
  const [datumMap, itemsWithValues] = useValueDatumMap<DatumValuedMenuItems<V, M>, V, M>({ items });
  return (
    <React.Fragment>
      {itemsWithValues.map((item, i) => (
        <ValuedMenuItemRenderer
          key={i}
          item={item}
          selected={value === item.value}
          withCheckbox={false}
          onClick={() => {
            if (item.value === undefined) {
              throw new Error("Unexpected Condition: Item value should not be undefined!");
            }
            onMenuItemClick(item.value as SingleMenuValue<V, N>, newState => {
              const datum = datumMap[item.value];
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

const _SingleValuedMenuItems = <V extends string | null, M, N extends boolean>({
  items,
  onMenuItemClick,
  onChange,
  value,
}: ChildMenuProps<V, M, N, ValuedMenuItems<V>>): JSX.Element => {
  const itemsWithValues = useItemValues<ValuedMenuItem<V>[], V, never>({ items });
  return (
    <React.Fragment>
      {itemsWithValues.map((item, i) => (
        <ValuedMenuItemRenderer
          key={i}
          item={item}
          selected={value === item.value}
          withCheckbox={false}
          onClick={() => {
            onMenuItemClick(item.value, newState => onChange?.(newState));
          }}
        />
      ))}
    </React.Fragment>
  );
};

export const SingleValuelessMenu = (props: SingleValuelessMenuProps): JSX.Element => {
  const { id, style, footerActions, className, shortcuts } = props;
  return (
    <BaseMenu id={id} footerActions={footerActions} className={className} style={style} shortcuts={shortcuts}>
      {props.items.map((item, i) => (
        <ValuelessMenuItemRenderer key={i} item={item} />
      ))}
    </BaseMenu>
  );
};

export const SingleValuedMenu = <
  V extends string | null,
  M,
  N extends boolean,
  I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>,
>(
  props: SingleValuedMenuProps<V, M, N, I>,
): JSX.Element => {
  const { id, style, footerActions, className, shortcuts, nullable, defaultValue, value } = props;

  const initialDefaultValue = useMemo<SingleMenuValue<V, N>>((): SingleMenuValue<V, N> => {
    if (isSingleMenuValuelessProps(props)) {
      // Here, the default value will not actually be used - so we just force coerce null to the single menu value type.
      return null as SingleMenuValue<V, N>;
    } else if (nullable) {
      return (defaultValue === undefined ? null : defaultValue) as SingleMenuValue<V, N>;
    } else if (defaultValue !== undefined) {
      return defaultValue as SingleMenuValue<V, N>;
    }
    throw new Error("A valued menu that is not nullable must provide a default value!");
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- The items key is the only thing that affects the typeguard. */
  }, [defaultValue, nullable, props.items]);

  const [_, startTransition] = useTransition();
  // We have to allow the _value to be undefined for the case that
  const [_value, setValue] = useState<SingleMenuValue<V, N>>(initialDefaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setValue(value);
    }
  }, [value]);

  const v = value === undefined ? _value : value;

  const onMenuItemClick = useMemo(
    () => (clickedValue: SingleMenuValue<V, N>, handler: (newState: SingleMenuValue<V, N>) => void) => {
      startTransition(() => setValue(clickedValue));
      handler(clickedValue);
    },
    [],
  );

  const children = useMemo(() => {
    if (isSingleMenuAnyValuedProps<V, M, N>(props)) {
      if (isSingleMenuDatumValuedProps<V, M, N>(props)) {
        const ps = {
          items: props.items,
          onMenuItemClick,
          value: v,
          onChange: props.onChange,
        } as ChildMenuProps<V, M, N, DatumValuedMenuItems<V, M>>;
        return <_SingleDatumValuedMenuItems {...ps} />;
      } else if (isSingleMenuValuedProps<V, M, N>(props)) {
        const ps = {
          items: props.items,
          onMenuItemClick,
          value: v,
          onChange: props.onChange,
        } as ChildMenuProps<V, M, N, ValuedMenuItems<V>>;
        return <_SingleValuedMenuItems {...ps} />;
      }
    }
    throw new Error("Corrupted props detected!");
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- The items key is the only thing that affects the typeguard. */
  }, [props.items, onMenuItemClick, v, props.onChange]);

  return (
    <BaseMenu<SingleMenuValue<V, N>, V, M, N, I>
      id={id}
      footerActions={footerActions}
      className={className}
      style={style}
      shortcuts={shortcuts}
      value={v}
    >
      {children}
    </BaseMenu>
  );
};

export default SingleValuedMenu;
