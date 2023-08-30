import { useMemo, useRef } from "react";

import {
  type DatumValuedMenuItem,
  type IMultiMenu,
  menuItemsAreAllDatumValued,
  menuItemsAreAllValued,
  type AnyValuedMenuItems,
  type DatumValuedMenuItems,
  type AnyValuedMenuItem,
} from "./types";

export const useItemValues = <I extends AnyValuedMenuItems<V, M>, V extends string | null, M>({
  items,
}: {
  items: I;
}): I => {
  const valuedItems = useMemo(() => {
    if (menuItemsAreAllDatumValued(items) || menuItemsAreAllValued(items)) {
      type IS = AnyValuedMenuItem<V, M>[];
      return [...items].reduce(
        (prev: IS[number][], item: IS[number]) => {
          const value = item.value;
          if (prev.map(i => i.value).includes(value)) {
            throw new Error(`Detected duplicate value '${value}' for menu items.  Values must be unique!`);
          }
          return [...prev, item];
        },
        [] as IS[number][],
      );
    }
    return items;
  }, [items]);
  return valuedItems as I;
};

type ValueDatumMap<V extends string | null, M> = { [key in Exclude<V, null>]: M };

type UseValueDatumMapProps<I extends DatumValuedMenuItems<V, M>, V extends string | null, M> = {
  readonly items: I;
};

type UseValueDatumMapRT<I extends DatumValuedMenuItem<V, M>[], V extends string | null, M> = [ValueDatumMap<V, M>, I];

export const useValueDatumMap = <I extends DatumValuedMenuItems<V, M>, V extends string | null, M>({
  items,
}: UseValueDatumMapProps<I, V, M>): UseValueDatumMapRT<I, V, M> => {
  const itemsWithValues = useItemValues({ items });
  const valueDatumMap = useMemo<ValueDatumMap<V, M>>(() => {
    const mapping = [...itemsWithValues].reduce(
      (prev: ValueDatumMap<V, M>, item: I[number]) => ({ ...prev, [item.value]: item.datum }),
      {} as ValueDatumMap<V, M>,
    );
    return mapping;
  }, [itemsWithValues]);

  return [valueDatumMap, itemsWithValues];
};

export const useMultiMenu = <V extends string | null>() => {
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  const ref = useRef<IMultiMenu<V>>({ setValue: () => {}, clear: () => {} });
  return ref;
};
