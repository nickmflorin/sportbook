import React, { type ReactNode } from "react";

import classNames from "classnames";

import { isJSXElement } from "~/lib/core";
import { type ComponentProps } from "~/lib/ui";
import { Header, type HeaderProps } from "~/components/views/Header";

export interface TileProps extends ComponentProps, HeaderProps {
  readonly children?: ReactNode;
}

export const Tile = ({ children, style, className, ...props }: TileProps): JSX.Element => (
  <div style={style} className={classNames("tile", className)}>
    <Header {...props} className="tile__header" />
    {isJSXElement(children) ? (
      React.cloneElement(children, { className: "tile__content" })
    ) : (
      <div className="tile__content">{children}</div>
    )}
  </div>
);
