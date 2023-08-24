import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";

export interface FilterBarProps extends ComponentProps {
  readonly children?: JSX.Element | JSX.Element[];
}

export const FilterBar = ({ children, ...props }: FilterBarProps): JSX.Element => (
  <div {...props} className={classNames("filter-bar", props.className)}>
    {children}
  </div>
);

export default FilterBar;
