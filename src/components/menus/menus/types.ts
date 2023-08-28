import { type Color, type ComponentProps } from "~/lib/ui";
import { type IconProp } from "~/components/icons";
import { type ImageProp } from "~/components/images";

export type IMenuItem = {
  readonly setLoading: (v: boolean) => void;
  readonly toggleLoading: () => void;
  readonly showSubContent: (content: JSX.Element) => void;
  readonly hideSubContent: () => void;
};

type BaseMenuItem = ComponentProps & {
  readonly label: string;
  readonly icon?: IconProp | ImageProp | JSX.Element;
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
  readonly onClick?: (item: IMenuItem, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
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

// export type DatumValuelessMenuItem<M> = BaseMenuItem & {
//   readonly datum: M;
// };

// export type ValuelessValueGetter<V extends string | null> = (item: ValuelessMenuItem) => Exclude<V, null>;

// export type DatumValuelessValueGetter<V extends string | null, M> = (item: M) => Exclude<V, null>;

export type MenuItem<V extends string | null, M> = DatumValuedMenuItem<V, M> | ValuedMenuItem<V> | ValuelessMenuItem;
// | DatumValuelessMenuItem<M>;

export type ValuedMenuItems<V extends string | null> = ValuedMenuItem<V>[];
export type DatumValuedMenuItems<V extends string | null, M> = DatumValuedMenuItem<V, M>[];

export type AnyValuedMenuItems<V extends string | null, M> = DatumValuedMenuItems<V, M> | ValuedMenuItems<V>;

export type MenuItems<V extends string | null, M> = AnyValuedMenuItems<V, M> | ValuelessMenuItem[];
// | DatumValuelessMenuItem<M>[];

// type OnChange<I extends MenuItems<V, M>, V extends string | null, M> = I extends DatumValuedMenuItem

export const menuItemIsDatumValued = <V extends string | null, M>(m: MenuItem<V, M>): m is DatumValuedMenuItem<V, M> =>
  (m as DatumValuedMenuItem<V, M>).value !== undefined && (m as DatumValuedMenuItem<V, M>).datum !== undefined;

// export const menuItemIsDatumValueless = <V extends string | null, M>(
//   m: MenuItem<V, M>,
// ): m is DatumValuedMenuItem<V, M> =>
//   (m as DatumValuedMenuItem<V, M>).value === undefined && (m as DatumValuelessMenuItem<M>).datum !== undefined;

export const menuItemIsValued = <V extends string | null, M>(m: MenuItem<V, M>): m is ValuedMenuItem<V> =>
  (m as ValuedMenuItem<V>).value !== undefined && (m as DatumValuedMenuItem<V, M>).datum === undefined;

export const menuItemIsValueless = <V extends string | null, M>(m: MenuItem<V, M>): m is ValuelessMenuItem =>
  !menuItemIsValued(m) && !menuItemIsDatumValued(m);

export const menuItemsAreAllDatumValued = <V extends string | null, M>(
  items: MenuItems<V, M>,
): items is DatumValuedMenuItems<V, M> => {
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

// export const menuItemsAreAllDatumValueless = <V extends string | null, M>(
//   items: MenuItems<V, M>,
// ): items is DatumValuelessMenuItem<M>[] => {
//   const filteredItems = [...items].filter((item): item is DatumValuelessMenuItem<M> => menuItemIsDatumValueless(item));
//   if (filteredItems.length !== 0) {
//     if (filteredItems.length !== items.length) {
//       throw new Error(
//         "Detected a mix of menu items with and without a datum property.  If a datum or value is included on an " +
//           "item, it must be included on all items.",
//       );
//     }
//     return true;
//   }
//   return false;
// };

export const menuItemsAreAllValued = <V extends string | null, M>(
  items: MenuItems<V, M>,
): items is ValuedMenuItems<V> => {
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

type MenuShortcut = {
  readonly label: string;
  readonly onClick?: () => void;
};

export type BaseMenuProps<P extends FooterActionsParams> = ComponentProps & {
  readonly id?: string;
  readonly shortcuts?: MenuShortcut[];
  readonly footerActions?: FooterActions<P>;
  readonly footerActionParams: P;
  readonly children: JSX.Element | JSX.Element[];
};

export type WithBaseMenuProps<T, P extends FooterActionsParams> = T extends never
  ? never
  : T & Omit<BaseMenuProps<P>, "children" | "footerActionParams">;

export type IMultiMenu<V extends string | null> = {
  readonly setValue: (value: Exclude<V, null>[]) => void;
  readonly clear: () => void;
};

type SingleValue<V extends string | null, N extends boolean> = N extends true ? V : Exclude<V, null>;
type SingleDatum<M, N extends boolean> = N extends true ? M | null : M;

export type OnSingleMenuChange<
  I extends MenuItems<V, M>,
  V extends string | null,
  M,
  N extends boolean,
> = I extends ValuedMenuItem<V>[]
  ? (value: SingleValue<V, N>) => void
  : I extends DatumValuedMenuItem<V, M>[]
  ? (value: SingleValue<V, N>, datum: SingleDatum<M, N>) => void
  : never;

export type OnMultiMenuChange<I extends MenuItems<V, M>, V extends string | null, M> = I extends DatumValuedMenuItem<
  V,
  M
>[]
  ? (value: Exclude<V, null>[], datum: M[]) => void
  : I extends ValuedMenuItem<V>[]
  ? (value: Exclude<V, null>[]) => void
  : never;

export type OnMenuChange<
  I extends ValuedMenuItem<V>[] | DatumValuedMenuItem<V, M>[] | ValuelessMenuItem[],
  V extends string | null,
  M,
  N extends boolean,
  MODE extends MenuSelectionMode,
> = {
  single: OnSingleMenuChange<I, V, M, N>;
  multiple: OnMultiMenuChange<I, V, M>;
}[MODE];

export type MultiMenuProps<
  V extends string | null,
  M,
  I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>,
> = I extends MenuItems<V, M>
  ? WithBaseMenuProps<
      {
        readonly items: I;
        readonly menu?: React.RefObject<IMultiMenu<V>>;
        readonly defaultValue?: Exclude<V, null>[];
        readonly value?: Exclude<V, null>[];
        readonly withCheckbox?: boolean;
        readonly footerActions?: FooterActions<{ value: Exclude<V, null>[] }>;
        readonly onChange?: OnMultiMenuChange<I, V, M>;
      },
      { value: Exclude<V, null>[] }
    >
  : never;

export const isMultiDatumValuedMenuProps = <V extends string | null, M>(
  props: MultiMenuProps<V, M>,
): props is MultiMenuProps<V, M, DatumValuedMenuItem<V, M>[]> => menuItemsAreAllDatumValued(props.items);

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

type Nullable<
  I extends ValuedMenuItem<V>[] | DatumValuedMenuItem<V, M>[] | ValuelessMenuItem[],
  V extends string | null,
  M,
  N extends boolean,
> = I extends ValuedMenuItem<V>[] | DatumValuedMenuItem<V, M>[]
  ? N extends true
    ? { readonly nullable: true }
    : { readonly nullable?: false }
  : { readonly nullable?: never };

type DefaultValue<
  I extends ValuedMenuItem<V>[] | DatumValuedMenuItem<V, M>[] | ValuelessMenuItem[],
  V extends string | null,
  M,
  N extends boolean,
> = I extends ValuedMenuItem<V>[] | DatumValuedMenuItem<V, M>[]
  ? N extends true
    ? { readonly defaultValue?: V }
    : { readonly defaultValue: Exclude<V, null> }
  : { readonly defaultValue?: never };

type Value<
  I extends ValuedMenuItem<V>[] | DatumValuedMenuItem<V, M>[] | ValuelessMenuItem[],
  V extends string | null,
  M,
  N extends boolean,
> = I extends ValuedMenuItem<V>[] | DatumValuedMenuItem<V, M>[]
  ? N extends true
    ? { readonly value: V }
    : { readonly value: Exclude<V, null> }
  : { readonly value?: never };

export type SingleMenuProps<
  I extends ValuedMenuItem<V>[] | DatumValuedMenuItem<V, M>[] | ValuelessMenuItem[],
  V extends string | null,
  M,
  N extends boolean,
> = WithBaseMenuProps<
  {
    readonly items: I;
    readonly menu?: React.RefObject<IMultiMenu<V>>;
    readonly footerActions?: FooterActions<{ value: Exclude<V, null>[] }>;
    readonly onChange?: OnSingleMenuChange<I, V, M, N>;
  } & Nullable<I, V, M, N> &
    Value<I, V, M, N> &
    DefaultValue<I, V, M, N>,
  { value: Exclude<V, null>[] }
>;
