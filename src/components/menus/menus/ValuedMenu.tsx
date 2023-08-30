import React from "react";

import { MultiMenu } from "./MultiMenu";
import { SingleValuedMenu } from "./SingleMenu";
import {
  type MultiMenuProps,
  type SingleValuedMenuProps,
  type AnyValuedMenuItems,
  isSingleMenuAnyValuedProps,
} from "./types";

export type ValuedMenuProps<V extends string | null, M, N extends boolean, I extends AnyValuedMenuItems<V, M>> =
  | SingleValuedMenuProps<V, M, N, I>
  | MultiMenuProps<V, M, I>;

const propsAreMultiple = <V extends string | null, M, N extends boolean, I extends AnyValuedMenuItems<V, M>>(
  props: SingleValuedMenuProps<V, M, N, I> | MultiMenuProps<V, M, I>,
): props is MultiMenuProps<V, M, I> => (props as MultiMenuProps<V, M, I>).mode === "multiple";

const propsAreSingle = <V extends string | null, M, N extends boolean, I extends AnyValuedMenuItems<V, M>>(
  props: SingleValuedMenuProps<V, M, N, I> | MultiMenuProps<V, M, I>,
): props is SingleValuedMenuProps<V, M, N, I> => (props as SingleValuedMenuProps<V, M, N, I>).mode === "single";

export const ValuedMenu = <V extends string | null, M, N extends boolean, I extends AnyValuedMenuItems<V, M>>(
  props: SingleValuedMenuProps<V, M, N, I> | MultiMenuProps<V, M, I>,
): JSX.Element => {
  if (propsAreMultiple<V, M, N, I>(props)) {
    return <MultiMenu<V, M, I> {...props} />;
  } else if (propsAreSingle<V, M, N, I>(props) && isSingleMenuAnyValuedProps<V, M, N>(props)) {
    return <SingleValuedMenu<V, M, N, I> {...props} />;
  }
  throw new Error("Invalid or corrupted props!");
};

export default ValuedMenu;
