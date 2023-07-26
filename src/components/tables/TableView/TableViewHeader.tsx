import classNames from "classnames";

import { TextInput } from "~/components/input/TextInput";
import { Header, type HeaderProps } from "~/components/views/Header";

export interface TableViewHeaderProps extends HeaderProps {
  readonly defaultSearch?: string;
  readonly onSearch?: (query: string) => void;
}

export const TableViewHeader = ({
  className,
  style,
  defaultSearch,
  onSearch,
  ...props
}: TableViewHeaderProps): JSX.Element => (
  <div style={style} className={classNames("table-view__header", className)}>
    <Header className="table-view__primary-header" {...props} />
    {onSearch !== undefined && (
      <div className="table-view__secondary-header">
        <TextInput
          className="table-view__search"
          placeholder="Search"
          defaultValue={defaultSearch}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
    )}
  </div>
);
