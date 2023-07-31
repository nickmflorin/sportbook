import React from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { AlternateButton } from "~/components/buttons/AlternateButton";

import { MultiMenu, type MultiMenuProps } from "./MultiMenu";
import { SingleMenu, type SingleMenuProps } from "./SingleMenu";

export { useMultiMenu } from "./MultiMenu";

type MenuShortcut = {
  readonly label: string;
  readonly onClick?: () => void;
};

export type WithMenuProps<P, V extends string | null, M> = P extends SingleMenuProps<V, M> | MultiMenuProps<V, M>
  ? P &
      ComponentProps & {
        readonly shortcuts?: MenuShortcut[];
        readonly footerActions?: JSX.Element | JSX.Element[];
      }
  : never;

export type MenuProps<V extends string | null, M> = WithMenuProps<SingleMenuProps<V, M> | MultiMenuProps<V, M>, V, M>;

export const Menu = <V extends string | null, M>({
  className,
  style,
  shortcuts,
  footerActions,
  ...props
}: MenuProps<V, M>): JSX.Element => (
  <div
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
    <div className="menu__items-container">
      {props.mode === "multiple" ? <MultiMenu {...props} /> : <SingleMenu {...props} />}
    </div>
    {footerActions && (!Array.isArray(footerActions) || footerActions.length !== 0) && (
      <div className="menu__footer-actions">
        {(Array.isArray(footerActions) ? footerActions : [footerActions]).map((action, i) => (
          <React.Fragment key={i}>{action}</React.Fragment>
        ))}
      </div>
    )}
  </div>
);
