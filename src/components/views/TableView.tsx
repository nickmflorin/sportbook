import { type ReactNode } from "react";

import classNames from "classnames";

import { TableViewHeader, type TableViewHeaderProps } from "./TableViewHeader";
import { View } from "./View";

export interface TableViewProps extends TableViewHeaderProps {
  readonly children: ReactNode;
  readonly header?: JSX.Element;
}

export const TableView = ({ children, header, className, style, ...props }: TableViewProps): JSX.Element => (
  <View style={style} className={classNames("table-view", className)} header={header || <TableViewHeader {...props} />}>
    {children}
  </View>
);
