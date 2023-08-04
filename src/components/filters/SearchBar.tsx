"use client";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

import { TextInput } from "~/components/input/TextInput";
import { useMutableSearchParams } from "~/hooks/useMutableSearchParams";

export interface SearchBarProps {
  readonly queryParamName?: string;
}

export const SearchBar = ({ queryParamName = "search" }: SearchBarProps) => {
  const { searchParams, updateParams } = useMutableSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get(queryParamName) || "";
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
