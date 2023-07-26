"use client";
import classNames from "classnames";

import { TableViewHeader, type TableViewHeaderProps } from "./TableViewHeader";

export interface TableViewProps extends TableViewHeaderProps {
  readonly children: JSX.Element;
}

// TODO: Consider making me a server component.
export const TableView = ({ children, className, style, ...props }: TableViewProps): JSX.Element => (
  <div style={style} className={classNames("table-view", className)}>
    <TableViewHeader {...props} />
    {children}
  </div>
);
