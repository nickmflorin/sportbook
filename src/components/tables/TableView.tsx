import classNames from "classnames";

import { Header, type HeaderProps } from "~/components/structural/Header";

export interface TableViewProps extends HeaderProps {
  readonly children: JSX.Element;
}

export const TableView = ({ children, className, style, ...props }: TableViewProps): JSX.Element => (
  <div style={style} className={classNames("table-view", className)}>
    <Header className="table-view__header" {...props} />
    {children}
  </div>
);
