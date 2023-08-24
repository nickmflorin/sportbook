import dynamic from "next/dynamic";

const SearchBar = dynamic(() => import("~/components/filters/SearchBar"), { ssr: false });
const FilterBar = dynamic(() => import("~/components/filters/FilterBar"));

// TODO: Should we dynamically load the search bar?  Or use suspense around it?
export const LeaguesFilterBar = async () => (
  <FilterBar>
    <SearchBar key="0" />
  </FilterBar>
);
