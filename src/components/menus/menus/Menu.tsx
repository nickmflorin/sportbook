import React from "react";

import { MultiMenu } from "./MultiMenu";
import { SingleValuedMenu, SingleValuelessMenu } from "./SingleMenu";
import {
  type MultiMenuProps,
  type SingleMenuProps,
  type AnyValuedMenuItems,
  isSingleMenuAnyValuedProps,
  isSingleMenuValuelessProps,
} from "./types";

export type MenuProps<V extends string | null, M, N extends boolean, I extends AnyValuedMenuItems<V, M>> =
  | SingleMenuProps<V, M, N, I>
  | MultiMenuProps<V, M, I>;

const propsAreMultiple = <V extends string | null, M, N extends boolean, I extends AnyValuedMenuItems<V, M>>(
  props: SingleMenuProps<V, M, N, I> | MultiMenuProps<V, M, I>,
): props is MultiMenuProps<V, M, I> => (props as MultiMenuProps<V, M, I>).mode === "multiple";

const propsAreSingle = <V extends string | null, M, N extends boolean, I extends AnyValuedMenuItems<V, M>>(
  props: SingleMenuProps<V, M, N, I> | MultiMenuProps<V, M, I>,
): props is SingleMenuProps<V, M, N, I> => (props as SingleMenuProps<V, M, N, I>).mode === "single";

export const Menu = <V extends string | null, M, N extends boolean, I extends AnyValuedMenuItems<V, M>>(
  props: SingleMenuProps<V, M, N, I> | MultiMenuProps<V, M, I>,
): JSX.Element => {
  if (propsAreMultiple<V, M, N, I>(props)) {
    return <MultiMenu<V, M, I> {...props} />;
  } else if (propsAreSingle<V, M, N, I>(props) && isSingleMenuAnyValuedProps<V, M, N, I>(props)) {
    return <SingleValuedMenu<V, M, N, I> {...props} />;
  } else if (propsAreSingle<V, M, N, I>(props) && isSingleMenuValuelessProps<V, M, N, I>(props)) {
    return <SingleValuelessMenu {...props} />;
  }
  throw new Error("Invalid or corrupted props!");
};

export default Menu;
