import { type ReactNode } from "react";

import classNames from "classnames";

import { TableViewHeader, type TableViewHeaderProps } from "./TableViewHeader";

export interface TableViewProps extends TableViewHeaderProps {
  readonly children: ReactNode;
  readonly header?: JSX.Element;
}

export const TableView = ({ children, header, className, style, ...props }: TableViewProps): JSX.Element => (
  <div style={style} className={classNames("table-view", className)}>
    {header || <TableViewHeader {...props} />}
    <div className="table-view__content">{children}</div>
  </div>
);
