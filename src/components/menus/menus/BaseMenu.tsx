import React from "react";

import classNames from "classnames";

import { AlternateButton } from "~/components/buttons/AlternateButton";

import {
  type SingleMenuValue,
  type MultiMenuValue,
  type BaseValuedMenuProps,
  type BaseValuelessMenuProps,
  type AnyValuedMenuItems,
  type FooterActions,
} from "./types";

const getFooterActions = <
  VS extends SingleMenuValue<V, N> | MultiMenuValue<V>,
  V extends string | null,
  N extends boolean,
>({
  footerActions: actions,
  value,
}: {
  footerActions: FooterActions<VS, V, N> | undefined;
  value: VS | undefined;
}): JSX.Element[] => {
  if (Array.isArray(actions)) {
    return actions;
  } else if (typeof actions === "function" && typeof value !== "undefined") {
    return getFooterActions({ footerActions: actions(value), value });
  } else if (actions && typeof actions !== "function") {
    return [actions];
  }
  return [];
};

type Props<
  VS extends SingleMenuValue<V, N> | MultiMenuValue<V>,
  V extends string | null,
  M,
  N extends boolean,
  I extends AnyValuedMenuItems<V, M>,
> = Omit<BaseValuedMenuProps<VS, V, M, I>, "items"> | Omit<BaseValuelessMenuProps, "items">;

export const BaseMenu = <
  VS extends SingleMenuValue<V, N> | MultiMenuValue<V>,
  V extends string | null,
  M,
  N extends boolean,
  I extends AnyValuedMenuItems<V, M>,
>({
  id,
  className,
  style,
  shortcuts,
  children,
  value,
  footerActions: _footerActions,
}: Props<VS, V, M, N, I> & { readonly children: JSX.Element | JSX.Element[] }): JSX.Element => {
  const footerActions = getFooterActions({ footerActions: _footerActions, value });
  return (
    <div
      id={id}
      style={style}
      className={classNames("menu", { "menu--with-shortcuts": shortcuts && shortcuts.length !== 0 }, className)}
    >
      {shortcuts && shortcuts.length !== 0 && (
        <div className="menu__shortcuts">
          {shortcuts.map((shortcut, i) => (
            <AlternateButton.Primary key={i} onClick={() => shortcut.onClick?.()}>
              {shortcut.label}
            </AlternateButton.Primary>
          ))}
        </div>
      )}
      <div className="menu__items-container">{children}</div>
      {footerActions.length !== 0 && (
        <div className="menu__footer-actions">
          {footerActions.map((action, i) => (
            <React.Fragment key={i}>{action}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
