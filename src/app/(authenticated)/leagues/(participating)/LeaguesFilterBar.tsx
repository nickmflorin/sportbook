import { FilterBar } from "~/components/filters/FilterBar";
import { SearchBar } from "~/components/filters/SearchBar";

// TODO: Should we dynamically load the search bar?  Or use suspense around it?
export const LeaguesFilterBar = async () => (
  <FilterBar>
    <SearchBar key="0" />
  </FilterBar>
);
