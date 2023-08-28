import React from "react";

import { MultiMenu, type MultiMenuProps } from "./MultiMenu";
import { SingleMenu, type SingleMenuProps, type SingleMenuValuedProps } from "./SingleMenu";
import { type MenuSelectionMode } from "./types";

type _MenuProps<V extends string | null, M, MODE extends MenuSelectionMode = MenuSelectionMode> = {
  single: SingleMenuProps<V, M>;
  multiple: MultiMenuProps<V, M>;
}[MODE];

export type MenuProps<
  V extends string | null,
  M,
  MODE extends MenuSelectionMode = MenuSelectionMode,
> = MODE extends MenuSelectionMode ? _MenuProps<V, M, MODE> & { readonly mode: MODE } : never;

const isMultiMenuProps = <V extends string | null, M>(props: MenuProps<V, M>): props is MenuProps<V, M, "multiple"> =>
  props.mode === "multiple";

export const Menu = <V extends string | null, M>(props: MenuProps<V, M>): JSX.Element => {
  if (isMultiMenuProps<V, M>(props)) {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { mode: _, ...rest } = props;
    return <MultiMenu {...rest} />;
  }
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { mode: _, ...rest } = props;
  return <SingleMenu {...rest} />;
};

type _ValuedMenuProps<V extends string | null, M, MODE extends MenuSelectionMode = MenuSelectionMode> = {
  single: SingleMenuValuedProps<V, M>;
  multiple: MultiMenuProps<V, M>;
}[MODE];

export type ValuedMenuProps<
  V extends string | null,
  M,
  MODE extends MenuSelectionMode = MenuSelectionMode,
> = MODE extends MenuSelectionMode ? _ValuedMenuProps<V, M, MODE> & { readonly mode: MODE } : never;

export const ValuedMenu = <V extends string | null, M>(props: ValuedMenuProps<V, M>): JSX.Element => {
  if (isMultiMenuProps<V, M>(props)) {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { mode: _, ...rest } = props;
    return <MultiMenu {...rest} />;
  }
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { mode: _, ...rest } = props;
  return <SingleMenu {...rest} />;
};

export default Menu;
