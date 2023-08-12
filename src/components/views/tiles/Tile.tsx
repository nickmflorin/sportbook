import React from "react";

import classNames from "classnames";
import { type Optional } from "utility-types";

import { isJSXElement } from "~/lib/core";
import { InfoView, type InfoViewProps } from "~/components/views/InfoView";

import { TileContainer, type TileContainerProps } from "./TileContainer";

export interface TileProps
  extends Optional<Omit<TileContainerProps, "direction" | "align" | "gap">, "children">,
    InfoViewProps {}

export const Tile = ({ children, style, className, ...props }: TileProps): JSX.Element => (
  <TileContainer style={style} direction="column" className={classNames("tile", className)}>
    <InfoView {...props} className="tile__header" />
    {isJSXElement(children) ? (
      React.cloneElement(children, { className: "tile__content" })
    ) : children ? (
      <div className="tile__content">{children}</div>
    ) : (
      <></>
    )}
  </TileContainer>
);
