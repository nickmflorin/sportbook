"use client";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

import { type Team } from "~/prisma/model";
import { Menu } from "~/components/menus/Menu";
import { useMutableSearchParams } from "~/hooks/useMutableSearchParams";

export type TeamMultiMenuProps = {
  readonly teams: Team[];
};

export const TeamClientMultiMenu = ({ teams }: TeamMultiMenuProps) => {
  const { updateParams } = useMutableSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [_, startTransition] = useTransition();

  return (
    <Menu
      mode="multiple"
      withCheckbox
      items={teams.map(datum => ({
        datum,
        label: datum.name,
        value: datum.id,
      }))}
      onChange={(d: string[]) => {
        startTransition(() => {
          const { queryString } = updateParams({ teams: encodeURIComponent(d.join(",")) });
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
