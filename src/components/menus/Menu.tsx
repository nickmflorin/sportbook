import React from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";

import { MultiMenu, type MultiMenuProps } from "./MultiMenu";
import { type SingleMenuProps } from "./SingleMenu";

export type MenuProps<V extends string | null, M> = (SingleMenuProps<V, M> | MultiMenuProps<V, M>) & ComponentProps;

export const Menu = <V extends string | null, M>({ style, className, ...props }: MenuProps<V, M>): JSX.Element => (
  <div style={style} className={classNames("menu", className)}>
    <div className="menu__items-container">{props.mode === "multiple" ? <MultiMenu {...props} /> : <></>}</div>
  </div>
);
