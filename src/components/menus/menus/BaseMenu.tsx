import React from "react";

import classNames from "classnames";

import { AlternateButton } from "~/components/buttons/AlternateButton";

import { type FooterActionsParams, type BaseMenuProps } from "./types";

const getFooterActions = <P extends FooterActionsParams>({
  footerActions: actions,
  footerActionParams,
}: Pick<BaseMenuProps<P>, "footerActions" | "footerActionParams">): JSX.Element[] => {
  if (Array.isArray(actions)) {
    return actions;
  } else if (typeof actions === "function") {
    return getFooterActions({ footerActions: actions(footerActionParams), footerActionParams });
  } else if (actions) {
    return [actions];
  }
  return [];
};

export const BaseMenu = <P extends FooterActionsParams>({
  id,
  className,
  style,
  shortcuts,
  children,
  footerActions: _footerActions,
  footerActionParams,
}: BaseMenuProps<P>): JSX.Element => {
  const footerActions = getFooterActions({ footerActions: _footerActions, footerActionParams });
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
