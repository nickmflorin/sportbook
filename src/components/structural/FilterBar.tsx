import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { TextInput } from "~/components/input/TextInput";

export interface FilterBarFiltersProps extends ComponentProps {
  readonly defaultSearch?: string;
  readonly filters: JSX.Element | JSX.Element[];
  readonly onSearch?: never;
}

export interface FilterBarSearchProps extends ComponentProps {
  readonly defaultSearch?: string;
  readonly filters?: JSX.Element | JSX.Element[];
  readonly onSearch: (query: string) => void;
}

export type FilterBarProps = FilterBarFiltersProps | FilterBarSearchProps;

export const FilterBar = ({ defaultSearch, filters, onSearch, ...props }: FilterBarProps): JSX.Element => (
  <div {...props} className={classNames("filter-bar", props.className)}>
    {onSearch !== undefined && (
      <TextInput
        className="filter-bar"
        placeholder="Search"
        defaultValue={defaultSearch}
        onChange={e => onSearch(e.target.value)}
        style={{ flexGrow: 100 }}
      />
    )}
    {filters}
  </div>
);
