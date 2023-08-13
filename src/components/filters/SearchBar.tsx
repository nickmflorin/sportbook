"use client";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

import { TextInput } from "~/components/input/TextInput";
import { useQueryParams } from "~/hooks/useQueryParams";

export interface SearchBarProps {
  readonly queryParamName?: string;
}

export const SearchBar = ({ queryParamName = "search" }: SearchBarProps) => {
  const { params, updateParams } = useQueryParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = params.get(queryParamName) || "";
  const [_, startTransition] = useTransition();

  return (
    <TextInput
      key="0"
      placeholder="Search"
      defaultValue={search}
      onChange={e => {
        startTransition(() => {
          const { queryString } = updateParams({ search: e.target.value });
          if (queryString !== "" && queryString !== null) {
            router.push(`${pathname}/?${queryString}`);
          } else {
            router.push(`${pathname}`);
          }
        });
      }}
      style={{ flexGrow: 100 }}
    />
  );
};

export default SearchBar;
