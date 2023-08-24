"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { addQueryParamsToUrl } from "~/lib/util/urls";
import { TextInput } from "~/components/input/TextInput";

export interface SearchBarProps {
  readonly queryParamName?: string;
}

export const SearchBar = ({ queryParamName = "search" }: SearchBarProps) => {
  const params = useSearchParams();
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
        const path = addQueryParamsToUrl(pathname, params, { search: e.target.value });
        startTransition(() => {
          router.push(path);
        });
      }}
      style={{ flexGrow: 100 }}
    />
  );
};

export default SearchBar;
