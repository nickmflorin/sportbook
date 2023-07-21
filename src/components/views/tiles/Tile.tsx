import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { Header, type HeaderProps } from "~/components/views/Header";

export interface TileProps extends ComponentProps, HeaderProps {
  readonly children?: ReactNode;
}

export const Tile = ({ children, style, className, ...props }: TileProps): JSX.Element => (
  <div style={style} className={classNames("tile", className)}>
    <Header {...props} className="tile__header" />
    <div className="tile__content">{children}</div>s
  </div>
);
