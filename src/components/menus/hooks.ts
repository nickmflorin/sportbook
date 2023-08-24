import { useMemo, useRef } from "react";

import {
  type DatumValuelessMenuItem,
  type ValuedMenuItem,
  type ValuelessMenuItem,
  type DatumValuedMenuItem,
  menuItemIsDatumValued,
  menuItemIsValued,
  menuItemIsDatumValueless,
  menuItemIsValueless,
  type MenuItems,
  type DatumValuelessValueGetter,
  type IMultiMenu,
  type ValuelessValueGetter,
} from "./types";

type GetItemValue<I extends MenuItems<V, M>, V extends string | null, M> = I extends DatumValuelessMenuItem<M>[]
  ? DatumValuelessValueGetter<V, M>
  : I extends ValuelessMenuItem[]
  ? ValuelessValueGetter<V>
  : never;

type UseItemValuesProps<I extends MenuItems<V, M>, V extends string | null, M> = {
  readonly items: I;
  readonly getValue?: GetItemValue<I, V, M>;
};

type ValueInjectedItems<I extends MenuItems<V, M>, V extends string | null, M> = I extends
  | DatumValuedMenuItem<V, M>[]
  | ValuedMenuItem<V>[]
  ? I
  : I extends DatumValuelessMenuItem<M>[] | ValuelessMenuItem[]
  ? (I[number] & { readonly value: Exclude<V, null> })[]
  : never;

export const useItemValues = <I extends MenuItems<V, M>, V extends string | null, M>({
  items,
  getValue,
}: UseItemValuesProps<I, V, M>): ValueInjectedItems<I, V, M> => {
  const valuedItems = useMemo(
    () =>
      [...items].reduce(
        (prev: ValueInjectedItems<I, V, M>[number][], item: I[number]) => {
          let value: Exclude<V, null>;
          if (menuItemIsDatumValued<V, M>(item) || menuItemIsValued<V, M>(item)) {
            value = item.value;
          } else if (getValue && menuItemIsDatumValueless<V, M>(item)) {
            const fn = getValue as DatumValuelessValueGetter<V, M>;
            value = fn(item.datum);
          } else if (getValue && menuItemIsValueless<V, M>(item)) {
            const fn = getValue as ValuelessValueGetter<V>;
            value = fn(item);
          } else {
            throw new Error("The getValue prop must be provided when using a menu item with no value!");
          }
          if (prev.map(i => i.value).includes(value)) {
            throw new Error(`Detected duplicate value '${value}' for menu items.  Values must be unique!`);
          }
          const newItemWithValue: ValueInjectedItems<I, V, M>[number] =
            menuItemIsDatumValued<V, M>(item) || menuItemIsValued<V, M>(item) ? item : { ...item, value };
          return [...prev, newItemWithValue];
        },
        [] as ValueInjectedItems<I, V, M>[number][],
      ),
    [items, getValue],
  );
  return valuedItems as ValueInjectedItems<I, V, M>;
};

type ValueDatumMap<V extends string | null, M> = { [key in Exclude<V, null>]: M };

type UseValueDatumMapProps<
  I extends DatumValuelessMenuItem<M>[] | DatumValuedMenuItem<V, M>[],
  V extends string | null,
  M,
> = {
  readonly items: I;
  readonly getValue?: (item: M) => Exclude<V, null>;
};

type UseValueDatumMapRT<
  I extends DatumValuelessMenuItem<M>[] | DatumValuedMenuItem<V, M>[],
  V extends string | null,
  M,
> = [ValueDatumMap<V, M>, ValueInjectedItems<I, V, M>];

export const useValueDatumMap = <
  I extends DatumValuelessMenuItem<M>[] | DatumValuedMenuItem<V, M>[],
  V extends string | null,
  M,
>({
  items,
  getValue,
}: UseValueDatumMapProps<I, V, M>): UseValueDatumMapRT<I, V, M> => {
  const itemsWithValues = useItemValues({ items, getValue: getValue as GetItemValue<I, V, M> });
  const valueDatumMap = useMemo<ValueDatumMap<V, M>>(() => {
    const mapping = [...itemsWithValues].reduce(
      (prev: ValueDatumMap<V, M>, item: ValueInjectedItems<I, V, M>[number]) => ({ ...prev, [item.value]: item.datum }),
      {} as ValueDatumMap<V, M>,
    );
    return mapping;
  }, [itemsWithValues]);

  return [valueDatumMap, itemsWithValues];
};

export type IDropdownMenu = {
  readonly close: () => void;
  readonly setButtonContent: (content: string | JSX.Element) => void;
};

export const useDropdownMenu = (): React.MutableRefObject<IDropdownMenu> =>
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  useRef<IDropdownMenu>({ setButtonContent: () => {}, close: () => {} });

export const useMultiMenu = <V extends string | null>() => {
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  const ref = useRef<IMultiMenu<V>>({ setValue: () => {}, clear: () => {} });
  return ref;
};
