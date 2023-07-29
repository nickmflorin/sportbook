import { SearchBar } from "~/components/input/SearchBar";
import { FilterBar } from "~/components/structural/FilterBar";

// TODO: Should we dynamically load the search bar?  Or use suspense around it?
export const LeaguesFilterBar = async () => <FilterBar filters={[<SearchBar key="0" />]} />;
