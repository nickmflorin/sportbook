import React from "react";

export type TilesDataProps<M extends Record<string, unknown>> = {
  readonly data: M[];
  readonly children?: (params: { datum: M }) => JSX.Element;
};

export type TilesChildrenProps = {
  readonly children: JSX.Element | JSX.Element[];
  readonly data?: never;
  readonly renderTileContent?: never;
  readonly renderTile?: never;
  readonly tileProps?: never;
};

export type TilesWrapperProps<M extends Record<string, unknown>> = TilesDataProps<M> | TilesChildrenProps;

export const TilesWrapper = <M extends Record<string, unknown>>({
  children,
  data,
}: TilesWrapperProps<M>): JSX.Element => (
  <div className="tiles">
    {data !== undefined && typeof children === "function" ? (
      data.map((datum, i) => <React.Fragment key={i}>{children({ datum })}</React.Fragment>)
    ) : typeof children !== "function" ? (
      children
    ) : (
      <></>
    )}
  </div>
);
