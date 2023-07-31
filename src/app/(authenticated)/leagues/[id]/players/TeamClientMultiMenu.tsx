"use client";
import { useRouter, usePathname } from "next/navigation";
import { useTransition, useMemo } from "react";

import { type Team } from "~/prisma/model";
import { parseQueryParamIds } from "~/prisma/urls";
import { SolidButton } from "~/components/buttons/SolidButton";
import { Menu, useMultiMenu } from "~/components/menus/Menu";
import { useMutableSearchParams } from "~/hooks/useMutableSearchParams";

export type TeamMultiMenuProps = {
  readonly teams: Team[];
  readonly playersTeam: Team | null;
};

export const TeamClientMultiMenu = ({ teams, playersTeam }: TeamMultiMenuProps) => {
  const { searchParams, updateParams } = useMutableSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [_, startTransition] = useTransition();

  const multiMenu = useMultiMenu();

  const teamIds = teams.map(t => t.id);
  const queryTeamIds = parseQueryParamIds({ params: searchParams, key: "teams" }).filter(id => teamIds.includes(id));

  const updateQuery = useMemo(
    () => (tms: string[] | null) => {
      const { queryString } = updateParams({ teams: tms === null ? tms : encodeURIComponent(tms.join(",")) });
      startTransition(() => {
        if (queryString !== "") {
          router.push(`${pathname}/?${queryString}`);
        } else {
          router.push(`${pathname}`);
        }
      });
    },
    [updateParams, pathname, router],
  );

  return (
    <Menu
      mode="multiple"
      withCheckbox
      defaultValue={queryTeamIds}
      menu={multiMenu}
      items={teams.map(datum => ({
        datum,
        label: datum.name,
        value: datum.id,
      }))}
      shortcuts={
        playersTeam !== null
          ? [
              {
                label: "Just My Team",
                onClick: () => multiMenu.current.setValue([playersTeam.id]),
              },
            ]
          : undefined
      }
      footerActions={[
        <SolidButton.Primary key="0" size="xs" onClick={() => multiMenu.current.clear()}>
          Clear All
        </SolidButton.Primary>,
      ]}
      onChange={(tms: string[]) => updateQuery(tms)}
    />
  );
};
