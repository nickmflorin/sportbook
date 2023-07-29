import classNames from "classnames";

import { Header, type HeaderProps } from "~/components/views/Header";

export interface TableViewHeaderProps extends HeaderProps {
  readonly filterBar?: JSX.Element;
}

export const TableViewHeader = ({ className, style, filterBar, ...props }: TableViewHeaderProps): JSX.Element => (
  <div style={style} className={classNames("table-view__header", className)}>
    <Header className="table-view__primary-header" {...props} />
    {filterBar}
  </div>
);
