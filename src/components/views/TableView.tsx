import { type ReactNode } from "react";

import classNames from "classnames";

import { View, type ViewProps } from "./View";

export interface TableViewProps extends Omit<ViewProps, "children"> {
  readonly children: ReactNode;
}

export const TableView = ({ children, ...props }: TableViewProps): JSX.Element => (
  <View {...props} className={classNames("table-view", props.className)}>
    {children}
  </View>
);
