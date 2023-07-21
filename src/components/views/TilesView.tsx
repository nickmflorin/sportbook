import React from "react";

import classNames from "classnames";

import { View, type WithViewProps } from "./View";

export type TilesViewDataProps<M extends Record<string, unknown>> = {
  readonly data: M[];
  readonly renderItem: (item: M) => JSX.Element;
  readonly children?: never;
};

export type TilesViewChildrenProps = {
  readonly children: JSX.Element | JSX.Element[];
  readonly data?: never;
  readonly renderItem?: never;
};

export type TilesViewProps<M extends Record<string, unknown>> =
  | WithViewProps<TilesViewDataProps<M>>
  | WithViewProps<TilesViewChildrenProps>;

export const TilesView = <M extends Record<string, unknown>>({
  children,
  data,
  renderItem,
  ...props
}: TilesViewProps<M>): JSX.Element => (
  <View {...props} className={classNames("tiles-view", props.className)}>
    {data !== undefined
      ? data.map((datum, i) => <React.Fragment key={i}>{renderItem(datum)}</React.Fragment>)
      : children}
  </View>
);
