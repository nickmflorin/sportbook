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

export type MenuItem<V extends string | null, M> = DatumValuedMenuItem<V, M> | ValuedMenuItem<V> | ValuelessMenuItem;

export type ValuedMenuItems<V extends string | null> = ValuedMenuItem<V>[];
export type DatumValuedMenuItems<V extends string | null, M> = DatumValuedMenuItem<V, M>[];

export type AnyValuedMenuItem<V extends string | null, M> = DatumValuedMenuItem<V, M> | ValuedMenuItem<V>;
export type AnyValuedMenuItems<V extends string | null, M> = DatumValuedMenuItems<V, M> | ValuedMenuItems<V>;

export type MenuItems<V extends string | null, M> = AnyValuedMenuItems<V, M> | ValuelessMenuItem[];

export const menuItemIsDatumValued = <V extends string | null, M>(m: MenuItem<V, M>): m is DatumValuedMenuItem<V, M> =>
  (m as DatumValuedMenuItem<V, M>).value !== undefined && (m as DatumValuedMenuItem<V, M>).datum !== undefined;

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

// /* export type FooterActionsParams<
//      VS extends SingleMenuValue<V, N> | MultiMenuValue<V>,
//      V extends string | null,
//      M,
//      N extends boolean,
//      I extends AnyValuedMenuItems<V, M>,
//    > = { readonly value: VS }; */

export type FooterActions<
  VS extends SingleMenuValue<V, N> | MultiMenuValue<V>,
  V extends string | null,
  N extends boolean,
> = _FooterAction | ((value: VS) => _FooterAction);

type MenuShortcut = {
  readonly label: string;
  readonly onClick?: () => void;
};

interface _BaseMenuProps {
  readonly id?: string;
  readonly style?: ComponentProps["style"];
  readonly className?: ComponentProps["className"];
  readonly shortcuts?: MenuShortcut[];
}

export interface BaseValuelessMenuProps extends _BaseMenuProps {
  readonly value?: never;
  readonly footerActions?: never;
  readonly items: ValuelessMenuItem[];
}

export interface BaseValuedMenuProps<
  VS extends SingleMenuValue<V, boolean> | MultiMenuValue<V>,
  V extends string | null,
  M,
  I extends AnyValuedMenuItems<V, M>,
> extends _BaseMenuProps {
  readonly items: I;
  readonly value?: VS;
  readonly footerActions?: FooterActions<VS, V, boolean>;
}

export type IMultiMenu<V extends string | null> = {
  readonly setValue: (value: Exclude<V, null>[]) => void;
  readonly clear: () => void;
};

export type OnMultiMenuChange<V extends string | null, M, I extends MenuItems<V, M>> = I extends DatumValuedMenuItems<
  V,
  M
>
  ? (value: Exclude<V, null>[], datum: M[]) => void
  : (value: Exclude<V, null>[]) => void;

export type OnMenuChange<
  I extends AnyValuedMenuItems<V, M>,
  V extends string | null,
  M,
  N extends boolean,
  MODE extends MenuSelectionMode,
> = {
  single: OnSingleMenuChange<V, M, N, I>;
  multiple: OnMultiMenuChange<V, M, I>;
}[MODE];

export type MultiMenuValue<V extends string | null> = Exclude<V, null>[];

export interface MultiMenuProps<
  V extends string | null,
  M,
  I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>,
> extends BaseValuedMenuProps<MultiMenuValue<V>, V, M, I> {
  readonly mode: "multiple";
  readonly menu?: React.RefObject<IMultiMenu<V>>;
  readonly defaultValue?: Exclude<V, null>[];
  readonly withCheckbox?: boolean;
  readonly onChange?: OnMultiMenuChange<V, M, I>;
}

export type MultiMenuType = {
  <V extends string | null, M, I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>>(
    props: MultiMenuProps<V, M, I>,
  ): JSX.Element;
};

export const isMultiDatumValuedMenuProps = <
  V extends string | null,
  M,
  I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>,
>(
  props: MultiMenuProps<V, M, I>,
): props is MultiMenuProps<V, M, I & DatumValuedMenuItems<V, M>> => menuItemsAreAllDatumValued(props.items);

export const isMultiValuedMenuProps = <
  V extends string | null,
  M,
  I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>,
>(
  props: MultiMenuProps<V, M, I>,
): props is MultiMenuProps<V, M, I & ValuedMenuItems<V>> => menuItemsAreAllValued(props.items);

/* type WithSingleMenuNullable<N extends boolean> = N extends true
     ? { readonly nullable: true }
     : { readonly nullable?: false }; */

// /* type WithSingleMenuDefaultValue<V extends string | null, N extends boolean> = N extends true
// //      ? { readonly defaultValue?: V }
// //      : { readonly defaultValue: Exclude<V, null> }; */

/* export type SingleMenuDefaultValue<V extends string | null, N extends boolean> = WithSingleMenuDefaultValue<
     V,
     N
   >["defaultValue"]; */

export type SingleMenuValue<V extends string | null, N extends boolean> = N extends true ? V : Exclude<V, null>;

type SingleDatum<M, N extends boolean> = N extends true ? M | null : M;

export type OnSingleMenuChange<
  V extends string | null,
  M,
  N extends boolean,
  I extends AnyValuedMenuItems<V, M>,
> = I extends DatumValuedMenuItems<V, M>
  ? (value: SingleMenuValue<V, N>, datum: SingleDatum<M, N>) => void
  : (value: SingleMenuValue<V, N>) => void;

export interface SingleValuedMenuProps<
  V extends string | null,
  M,
  N extends boolean,
  I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>,
> extends BaseValuedMenuProps<SingleMenuValue<V, N>, V, M, I> {
  readonly mode: "single";
  readonly nullable?: boolean;
  readonly onChange?: OnSingleMenuChange<V, M, N, I>;
  readonly defaultValue: Exclude<V, null>;
}

export type SingleValuelessMenuProps = BaseValuelessMenuProps & {
  readonly mode: "single";
  readonly onChange?: never;
  readonly defaultValue?: never;
  readonly nullable?: never;
};

export type SingleMenuProps<
  V extends string | null,
  M,
  N extends boolean,
  I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>,
> = SingleValuelessMenuProps | SingleValuedMenuProps<V, M, N, I>;

export const isSingleMenuValuelessProps = <
  V extends string | null,
  M,
  N extends boolean,
  I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>,
>(
  props: SingleValuedMenuProps<V, M, N, I> | SingleValuelessMenuProps,
): props is SingleValuelessMenuProps => menuItemsAreAllValueless(props.items);

export const isSingleMenuValuedProps = <
  V extends string | null,
  M,
  N extends boolean,
  I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>,
>(
  props: SingleValuedMenuProps<V, M, N, I>,
): props is SingleValuedMenuProps<V, M, N, I & ValuedMenuItems<V>> => menuItemsAreAllValued(props.items);

export const isSingleMenuDatumValuedProps = <
  V extends string | null,
  M,
  N extends boolean,
  I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>,
>(
  props: SingleValuedMenuProps<V, M, N, I>,
): props is SingleValuedMenuProps<V, M, N, I & DatumValuedMenuItems<V, M>> => menuItemsAreAllDatumValued(props.items);

export const isSingleMenuAnyValuedProps = <
  V extends string | null,
  M,
  N extends boolean,
  I extends AnyValuedMenuItems<V, M> = AnyValuedMenuItems<V, M>,
>(
  props: SingleValuedMenuProps<V, M, N, I> | SingleValuelessMenuProps,
): props is SingleValuedMenuProps<V, M, N, I> =>
  menuItemsAreAllValued(props.items) || menuItemsAreAllDatumValued(props.items);

export type SingleMenuType = {
  <V extends string | null, M, N extends boolean, I extends AnyValuedMenuItems<V, M>>(
    props: SingleMenuProps<V, M, N, I>,
  ): JSX.Element;
};
