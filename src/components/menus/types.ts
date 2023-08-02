import { type Color, type ComponentProps } from "~/lib/ui";
import { type IconProp } from "~/components/icons";
import { type ImageProp } from "~/components/images";

type BaseMenuItem = ComponentProps & {
  readonly label: string;
  readonly icon?: IconProp | ImageProp;
  /**
   * Whether or not the {@link MenuItem} is in a loading state and should indicate as such with a loading indicator.
   *
   * Note: The loading state on the {@link MenuItem} can also be set via {@link React.MutableRefObject<MenuItem>} that
   * is included in the 'onClick' callback.
   *
   * Default: false
   */
  readonly loading?: boolean;
  /**
   * Whether or not the the {@link MenuItem} should be disabled.
   *
   * Default: false
   */
  readonly disabled?: boolean;
  /**
   * Whether or not the the {@link MenuItem} should be visible, and included in the menu.
   *
   * Default: true
   */
  readonly visible?: boolean;
  /**
   * Whether or not the the {@link MenuItem} should be hidden, and excluded from the menu.
   *
   * Default: false
   */
  readonly hidden?: boolean;
  /**
   * The color of the 'icon' ({@link Icon}) that is used in the {@link MenuItem}.
   *
   * Default: "gray.5"
   */
  readonly iconColor?: Color;
  readonly onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export type MenuSelectionMode = "single" | "multiple";

export type ValuedMenuItem<V extends string | null> = BaseMenuItem & {
  readonly value: Exclude<V, null>;
};

export type DatumValuedMenuItem<V extends string | null, M> = BaseMenuItem & {
  readonly datum: M;
  readonly value: Exclude<V, null>;
};

export type ValuelessMenuItem = BaseMenuItem;

export type DatumValuelessMenuItem<M> = BaseMenuItem & {
  readonly datum: M;
};

export type ValuelessValueGetter<V extends string | null> = (item: ValuelessMenuItem) => Exclude<V, null>;

export type DatumValuelessValueGetter<V extends string | null, M> = (item: M) => Exclude<V, null>;

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
  (m as DatumValuedMenuItem<V, M>).value === undefined && (m as DatumValuelessMenuItem<M>).datum !== undefined;

export const menuItemIsValued = <V extends string | null, M>(m: MenuItem<V, M>): m is ValuedMenuItem<V> =>
  (m as ValuedMenuItem<V>).value !== undefined && (m as DatumValuedMenuItem<V, M>).datum === undefined;

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

export const menuItemsAreAllValueless = <V extends string | null, M>(
  items: MenuItems<V, M>,
): items is ValuelessMenuItem[] => {
  const filteredItems = [...items].filter((item): item is ValuedMenuItem<V> => menuItemIsValueless(item));
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

type _FooterAction = JSX.Element | JSX.Element[];
export type FooterActionsParams = Record<string, unknown>;
export type FooterActions<P extends FooterActionsParams> = _FooterAction | ((params: P) => _FooterAction);
