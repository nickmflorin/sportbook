import { TextInput } from "@mantine/core";
import classNames from "classnames";

import { Header, type HeaderProps } from "~/components/structural/Header";

export interface TableViewHeaderProps extends HeaderProps {
  readonly children: JSX.Element;
  readonly defaultSearch?: string;
  readonly onSearch?: (query: string) => void;
}

export const TableView = ({
  children,
  className,
  style,
  defaultSearch,
  onSearch,
  ...props
}: TableViewHeaderProps): JSX.Element => (
  <div style={style} className={classNames("table-view", className)}>
    <Header className="table-view__header" {...props} />
    {onSearch !== undefined && (
      <TextInput
        className="table-view__search"
        placeholder="Search"
        defaultValue={defaultSearch}
        onChange={e => onSearch(e.target.value)}
      />
    )}
    {children}
  </div>
);
