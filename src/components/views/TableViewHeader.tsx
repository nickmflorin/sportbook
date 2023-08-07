import classNames from "classnames";

import { ViewHeader, type ViewHeaderProps } from "~/components/views/ViewHeader";

export interface TableViewHeaderProps extends Omit<ViewHeaderProps, "children"> {
  readonly filterBar?: JSX.Element;
}

export const TableViewHeader = ({ filterBar, ...props }: TableViewHeaderProps): JSX.Element => (
  <ViewHeader {...props} className={classNames("table-view__header", props.className)}>
    {filterBar}
  </ViewHeader>
);
