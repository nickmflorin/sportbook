"use client";
import React, { useState, useEffect, useMemo, useTransition } from "react";

import { type Required } from "utility-types";

import { BaseMenu } from "./BaseMenu";
import { useValueDatumMap, useItemValues } from "./hooks";
import { ValuedMenuItemRenderer, ValuelessMenuItemRenderer } from "./items";
import {
  // type DatumValuelessMenuItem,
  type ValuedMenuItem,
  type DatumValuedMenuItem,
  // type DatumValuelessValueGetter,
  type ValuelessMenuItem,
  menuItemsAreAllValued,
  menuItemsAreAllDatumValued,
  // menuItemsAreAllDatumValueless,
  menuItemsAreAllValueless,
  WithBaseMenuProps,
  BaseMenuProps,
} from "./types";

// export type SingleMenuValuelessProps = {
//   readonly value?: never;
//   readonly items: ValuelessMenuItem[];
//   readonly defaultValue?: never;
//   readonly onChange?: never;
// };

// type _SingleNullableMixin<V extends string | null> = {
//   readonly value: V;
//   readonly nullable: true;
//   readonly defaultValue?: V;
// };

// type _SingleNonNullableMixin<V extends string | null> = {
//   // The default value is required for non-nullable menus.
//   readonly value: Exclude<V, null>;
//   readonly nullable?: false;
//   readonly defaultValue: Exclude<V, null>;
// };

// type SingleV<V extends string | null, N extends boolean> = N extends true ? V : Exclude<V, null>;
// type SingleD<M, N extends boolean> = N extends true ? M | null : M;

// type OnSingleMenuChange<
//   I extends ValuedMenuItem<V>[] | DatumValuedMenuItem<V, M>[] | ValuelessMenuItem[],
//   V extends string | null,
//   M,
//   N extends boolean,
// > = I extends ValuedMenuItem<V>[]
//   ? (value: SingleV<V, N>) => void
//   : I extends DatumValuedMenuItem<V, M>[]
//   ? (value: SingleV<V, N>, datum: SingleD<M, N>) => void
//   : never;

// type _SingleNullableProps<V extends string | null> = _SingleNullableMixin<V> & {
//   readonly items: ValuedMenuItem<V>[];
//   readonly onChange?: (value: V | null) => void;
// };

// type _SingleNonNullableProps<V extends string | null> = _SingleNonNullableMixin<V> & {
//   readonly items: ValuedMenuItem<V>[];
//   readonly onChange?: (value: Exclude<V, null>) => void;
// };

// type _SingleDatumNullableProps<V extends string | null, M> = _SingleNullableMixin<V> & {
//   readonly items: DatumValuedMenuItem<V, M>[];
//   readonly onChange?: (value: V | null, data: M) => void;
// };

// type _SingleDatumNonNullableProps<V extends string | null, M> = _SingleNonNullableMixin<V> & {
//   readonly items: DatumValuedMenuItem<V, M>[];
//   readonly onChange?: (value: Exclude<V, null>, data: M) => void;
// };

// type _SingleDatumNullableCallbackProps<V extends string | null, M> = _SingleNullableMixin<V> & {
//   readonly items: DatumValuelessMenuItem<M>[];
//   // readonly getValue: DatumValuelessValueGetter<V, M>;
//   readonly onChange?: (value: V | null, data: M | null) => void;
// };

// type _SingleDatumNonNullableCallbackProps<V extends string | null, M> = _SingleNonNullableMixin<V> & {
//   readonly items: DatumValuelessMenuItem<M>[];
//   // readonly getValue: DatumValuelessValueGetter<V, M>;
//   readonly onChange?: (value: Exclude<V, null>, data: M) => void;
// };

// type SingleMenuNullableProps<V extends string | null, M> = _SingleNullableProps<V> | _SingleDatumNullableProps<V, M>;
// // | _SingleDatumNullableCallbackProps<V, M>;

// type SingleMenuNonNullableProps<V extends string | null, M> =
//   | _SingleNonNullableProps<V>
//   // | _SingleDatumNonNullableCallbackProps<V, M>
//   | _SingleDatumNonNullableProps<V, M>;

type _SingleMenuValuedProps<V extends string | null, M> =
  | SingleMenuNullableProps<V, M>
  | SingleMenuNonNullableProps<V, M>;

const isSingleValuelessProps = <V extends string | null, M>(
  props: SingleMenuProps<V, M> | SingleMenuValuelessProps,
): props is SingleMenuValuelessProps => menuItemsAreAllValueless(props.items);

type WithItem<
  P,
  V extends string | null,
  M,
  I extends DatumValuedMenuItem<V, M>[] | ValuedMenuItem<V>[] = DatumValuedMenuItem<V, M>[] | ValuedMenuItem<V>[],
> = P & { readonly items: I };

const isSingleValuedProps = <P, V extends string | null, M>(
  props: WithItem<P, V, M>,
): props is WithItem<P, V, M, ValuedMenuItem<V>[]> & { onChange?: (value: Exclude<V, null>) => void } =>
  menuItemsAreAllValued(props.items);

const isSingleDatumProps = <P, V extends string | null, M>(
  props: WithItem<P, V, M>,
): props is WithItem<P, V, M, DatumValuedMenuItem<V, M>[]> => menuItemsAreAllDatumValued(props.items);

// const isSingleDatumCallbackProps = <
//   P extends { readonly getValue?: DatumValuelessValueGetter<V, M> },
//   V extends string | null,
//   M,
// >(
//   props: WithItem<P, V, M>,
// ): props is WithItem<P, V, M, DatumValuelessMenuItem<M>[]> & Required<P, "getValue"> =>
//   menuItemsAreAllDatumValueless(props.items) &&
//   (props as WithItem<P, V, M, DatumValuelessMenuItem<M>[]>).getValue !== undefined;

type WithSingleBaseMenuProps<P> = P extends { readonly value?: infer V }
  ? WithBaseMenuProps<P, { value: V }>
  : WithBaseMenuProps<P, never>;

type _SingleMenuProps<V extends string | null, M> = _SingleMenuValuedProps<V, M> | SingleMenuValuelessProps;

export type SingleMenuValuedProps<V extends string | null, M> = WithSingleBaseMenuProps<_SingleMenuValuedProps<V, M>>;

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

const SingleValuelessMenu = ({ items, ...props }: WithSingleBaseMenuProps<SingleMenuValuelessProps>): JSX.Element => (
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
}: WithPolymorphicProps<_SingleNonNullableProps<V>, V, never>): JSX.Element => {
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
}: WithPolymorphicProps<_SingleDatumNonNullableProps<V, M>, V, M>): JSX.Element => {
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

// const _SingleDatumNonNullableCallbackMenu = <V extends string | null, M>({
//   items,
//   onMenuItemClick,
//   onChange,
//   getValue,
//   value,
// }: WithPolymorphicProps<_SingleDatumNonNullableCallbackProps<V, M>, V, M>): JSX.Element => {
//   const [atumMap, itemsWithValues] = useValueDatumMap<DatumValuelessMenuItem<M>[], V, M>({ items, getValue });

//   return (
//     <React.Fragment>
//       {itemsWithValues.map((item, i) => (
//         <ValuedMenuItemRenderer
//           key={i}
//           item={item}
//           selected={value === item.value}
//           withCheckbox={false}
//           onClick={() => {
//             onMenuItemClick(item.value, newState => {
//               const datum = atumMap[item.value];
//               if (datum === undefined) {
//                 throw new Error(`No datum was found for menu item with value '${item.value}'.`);
//               }
//               onChange?.(newState, datum);
//             });
//           }}
//         />
//       ))}
//     </React.Fragment>
//   );
// };

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
      id={props.id}
      footerActions={props.footerActions}
      className={props.className}
      style={props.style}
      shortcuts={props.shortcuts}
      footerActionParams={{ value: v }}
    >
      {isSingleDatumProps(props) ? (
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

export type SingleMenuType = {
  <V extends string | null, M>(props: SingleMenuProps<V, M>): JSX.Element;
};

export default SingleMenu;
