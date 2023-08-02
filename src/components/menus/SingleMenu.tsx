import React, { useState, useEffect, useMemo, useTransition } from "react";

import { type Required } from "utility-types";

import { type WithBaseMenuProps, type BaseMenuProps, BaseMenu } from "./BaseMenu";
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
  readonly value?: T;
};

export type SingleValuelessProps = {
  readonly items: ValuelessMenuItem[];
};

type SingleNullableMixin<V extends string | null> = SingleMixin<V, V> & {
  readonly nullable: true;
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

const isSingleValuelessProps = <V extends string | null, M>(
  props: SingleMenuProps<V, M> | SingleValuelessProps,
): props is SingleValuelessProps => menuItemsAreAllValueless(props.items);

type WithItem<
  P,
  V extends string | null,
  M,
  I extends DatumValuelessMenuItem<M>[] | DatumValuedMenuItem<V, M>[] | ValuedMenuItem<V>[] =
    | DatumValuelessMenuItem<M>[]
    | DatumValuedMenuItem<V, M>[]
    | ValuedMenuItem<V>[],
> = P & { readonly items: I };

const isSingleValuedProps = <P, V extends string | null, M>(
  props: WithItem<P, V, M>,
): props is WithItem<P, V, M, ValuedMenuItem<V>[]> & { onChange?: (value: Exclude<V, null>) => void } =>
  menuItemsAreAllValued(props.items);

const isSingleDatumProps = <P, V extends string | null, M>(
  props: WithItem<P, V, M>,
): props is WithItem<P, V, M, DatumValuedMenuItem<V, M>[]> => menuItemsAreAllDatumValued(props.items);

const isSingleDatumCallbackProps = <
  P extends { readonly getValue?: DatumValuelessValueGetter<V, M> },
  V extends string | null,
  M,
>(
  props: WithItem<P, V, M>,
): props is WithItem<P, V, M, DatumValuelessMenuItem<M>[]> & Required<P, "getValue"> =>
  menuItemsAreAllDatumValueless(props.items) &&
  (props as WithItem<P, V, M, DatumValuelessMenuItem<M>[]>).getValue !== undefined;

type WithSingleBaseMenuProps<P> = P extends { readonly value?: infer V }
  ? WithBaseMenuProps<P, { value: V }>
  : WithBaseMenuProps<P, never>;

type _SingleMenuProps<V extends string | null, M> = SingleMenuValuedProps<V, M> | SingleValuelessProps;
export type SingleMenuProps<V extends string | null, M> = WithSingleBaseMenuProps<_SingleMenuProps<V, M>>;

type WithPolymorphicProps<P extends SingleMenuValuedProps<V, M>, V extends string | null, M> = Omit<
  P,
  "value" | "defaultValue" | keyof (keyof BaseMenuProps<never>)
> & {
  readonly value: Required<P, "value">["value"];
  readonly onMenuItemClick: (value: Exclude<V, null>, handler: (newState: Exclude<V, null>) => void) => void;
};

export const isSingleMenuNonNullableProps = <V extends string | null, M>(
  props: _SingleMenuProps<V, M>,
): props is SingleMenuNonNullableProps<V, M> =>
  (props as SingleMenuNullableProps<V, M>).nullable !== true && !isSingleValuelessProps(props);

const SingleValuelessMenu = ({ items, ...props }: WithSingleBaseMenuProps<SingleValuelessProps>): JSX.Element => (
  <BaseMenu {...props} footerActionParams={{} as never}>
    {items.map((item, i) => (
      <ValuelessMenuItemRenderer key={i} item={item} />
    ))}
  </BaseMenu>
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

export const SingleNonNullableMenu = <V extends string | null, M>(
  props: WithSingleBaseMenuProps<SingleMenuNonNullableProps<V, M>>,
): JSX.Element => {
  const [_value, setValue] = useState<Exclude<V, null>>(props.defaultValue);

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  const [_, startTransition] = useTransition();

  const onMenuItemClick = useMemo(
    () => (clickedValue: Exclude<V, null>, handler: (newState: Exclude<V, null>) => void) => {
      startTransition(() => setValue(clickedValue));
      handler(clickedValue);
    },
    [],
  );

  const v = props.value === undefined ? _value : props.value;

  return (
    <BaseMenu
      footerActions={props.footerActions}
      className={props.className}
      style={props.style}
      shortcuts={props.shortcuts}
      footerActionParams={{ value: v }}
    >
      {isSingleDatumCallbackProps(props) ? (
        <_SingleDatumNonNullableCallbackMenu<V, M> {...props} value={v} onMenuItemClick={onMenuItemClick} />
      ) : isSingleDatumProps(props) ? (
        <_SingleDatumNonNullableMenu<V, M> {...props} value={v} onMenuItemClick={onMenuItemClick} />
      ) : isSingleValuedProps(props) ? (
        <_SingleNonNullableMenu<V> {...props} value={v} onMenuItemClick={onMenuItemClick} />
      ) : (
        <></>
      )}
    </BaseMenu>
  );
};

export const SingleMenu = <V extends string | null, M>(props: SingleMenuProps<V, M>): JSX.Element => {
  if (isSingleMenuNonNullableProps<V, M>(props)) {
    return <SingleNonNullableMenu {...props} />;
  } else if (isSingleValuelessProps<V, M>(props)) {
    return <SingleValuelessMenu {...props} />;
  } else {
    return <></>;
  }
};
