"use client";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

import { type Team } from "~/prisma/model";
import { parseQueryParamIds } from "~/prisma/urls";
import { Menu } from "~/components/menus/Menu";
import { useMutableSearchParams } from "~/hooks/useMutableSearchParams";

export type TeamMultiMenuProps = {
  readonly teams: Team[];
};

export const TeamClientMultiMenu = ({ teams }: TeamMultiMenuProps) => {
  const { searchParams, updateParams } = useMutableSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [_, startTransition] = useTransition();

  const teamIds = teams.map(t => t.id);
  const queryTeamIds = parseQueryParamIds({ params: searchParams, key: "teams" }).filter(id => teamIds.includes(id));

  return (
    <Menu
      mode="multiple"
      withCheckbox
      defaultValue={queryTeamIds}
      items={teams.map(datum => ({
        datum,
        label: datum.name,
        value: datum.id,
      }))}
      onChange={(d: string[]) => {
        const { queryString } = updateParams({ teams: encodeURIComponent(d.join(",")) });
        startTransition(() => {
          if (queryString !== "") {
            router.push(`${pathname}/?${queryString}`);
          } else {
            router.push(`${pathname}`);
          }
        });
      }}
    />
  );
};
