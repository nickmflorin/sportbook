import { type ImageProp } from "~/lib/ui";
import { type IconProp } from "~/components/icons";

type BaseMenuItem = {
  readonly label: string;
  readonly icon?: IconProp | ImageProp;
};

export type MenuSelectionMode = "single" | "multiple";

export type ValuedMenuItem<V extends string | null> = BaseMenuItem & {
  readonly value: Exclude<V, null>;
  readonly datum?: never;
  readonly onClick?: never;
};

export type DatumValuedMenuItem<V extends string | null, M> = BaseMenuItem & {
  readonly datum: M;
  readonly value: Exclude<V, null>;
  readonly onClick?: never;
};

export type ValuelessMenuItem = BaseMenuItem & {
  readonly datum?: never;
  readonly value?: never;
  readonly onClick?: () => void;
};

export type DatumValuelessMenuItem<M> = BaseMenuItem & {
  readonly datum: M;
  readonly value?: never;
  readonly onClick?: () => void;
};

export type MenuItem<V extends string | null, M> =
  | DatumValuedMenuItem<V, M>
  | ValuedMenuItem<V>
  | ValuelessMenuItem
  | DatumValuelessMenuItem<M>;

export type MenuItems<V extends string | null, M> =
  | DatumValuedMenuItem<V, M>[]
  | ValuedMenuItem<V>[]
  | ValuelessMenuItem[]
  | DatumValuelessMenuItem<M>[];

export const menuItemIsDatumValued = <V extends string | null, M>(m: MenuItem<V, M>): m is DatumValuedMenuItem<V, M> =>
  (m as DatumValuedMenuItem<V, M>).value !== undefined && (m as DatumValuedMenuItem<V, M>).datum !== undefined;

export const menuItemIsDatumValueless = <V extends string | null, M>(
  m: MenuItem<V, M>,
): m is DatumValuedMenuItem<V, M> =>
  (m as DatumValuelessMenuItem<M>).value === undefined && (m as DatumValuelessMenuItem<M>).datum !== undefined;

export const menuItemIsValued = <V extends string | null, M>(m: MenuItem<V, M>): m is ValuedMenuItem<V> =>
  (m as ValuedMenuItem<V>).value !== undefined && (m as ValuedMenuItem<V>).datum === undefined;

export const menuItemIsValueless = <V extends string | null, M>(m: MenuItem<V, M>): m is ValuelessMenuItem =>
  !menuItemIsValued(m) && !menuItemIsDatumValued(m);

export const menuItemsAreAllDatumValued = <V extends string | null, M>(
  items: MenuItems<V, M>,
): items is DatumValuedMenuItem<V, M>[] => {
  const filteredItems = [...items].filter((item): item is DatumValuedMenuItem<V, M> => menuItemIsDatumValued(item));
  if (filteredItems.length !== 0) {
    if (filteredItems.length !== items.length) {
      throw new Error(
        "Detected a mix of menu items with and without a datum and/or value property.  If a datum or value is " +
          "included on an item, it must be included on all items.",
      );
    }
    return true;
  }
  return false;
};

export const menuItemsAreAllDatumValueless = <V extends string | null, M>(
  items: MenuItems<V, M>,
): items is DatumValuelessMenuItem<M>[] => {
  const filteredItems = [...items].filter((item): item is DatumValuelessMenuItem<M> => menuItemIsDatumValueless(item));
  if (filteredItems.length !== 0) {
    if (filteredItems.length !== items.length) {
      throw new Error(
        "Detected a mix of menu items with and without a datum property.  If a datum or value is included on an " +
          "item, it must be included on all items.",
      );
    }
    return true;
  }
  return false;
};

export const menuItemsAreAllValued = <V extends string | null, M>(
  items: MenuItems<V, M>,
): items is ValuedMenuItem<V>[] => {
  const filteredItems = [...items].filter((item): item is ValuedMenuItem<V> => menuItemIsValued(item));
  if (filteredItems.length !== 0) {
    if (filteredItems.length !== items.length) {
      throw new Error(
        "Detected a mix of menu items with and without a value property.  If a value is included on an item, it must " +
          "be included on all items.",
      );
    }
    return true;
  }
  return false;
};
