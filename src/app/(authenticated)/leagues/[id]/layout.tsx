import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import { prisma } from "~/prisma/client";
import { LeagueStaffRole } from "~/prisma/model";
import { getAuthUser } from "~/server/auth";
import { Badge } from "~/components/badges/Badge";
import { DetailPage } from "~/components/layout/DetailPage";

import { getLeague, preloadLeague } from "./getLeague";
import { useUserLeagueStaffRoles } from "./hooks";
import { LeagueDrawers } from "./LeagueDrawers";
import { preloadPlayers } from "./players/getPlayers";

interface LeagueLayoutProps {
  readonly params: { id: string };
  readonly children: ReactNode;
}

export default async function LeagueLayout({ children, params: { id } }: LeagueLayoutProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });

  preloadPlayers({ leagueId: id, user });
  preloadLeague(id, user);

  const { getImage, ...league } = await getLeague(id, user);
  const fileUpload = await getImage();

  const numPlayers = await prisma.leaguePlayer.count({ where: { teamId: { in: league.teams.map(l => l.id) } } });

  const { hasLeagueRole } = await useUserLeagueStaffRoles(user, league);

  return (
    <>
      <DetailPage
        title={league.name}
        description={[league.description]}
        headerProps={{
          image: { url: fileUpload === null ? null : fileUpload.fileUrl, initials: league.name },
          tags: [
            <Badge key="0" size="xxs">{`${league.teams.length} Teams`}</Badge>,
            <Badge key="`" size="xxs">{`${numPlayers} Players`}</Badge>,
          ],
        }}
        backHref="/leagues"
        backText="All Leagues"
        tabQueryParams={["teamid", "playerid"]}
        tabs={[
          {
            label: "Standings",
            href: `/leagues/${id}/standings`,
            icon: { name: "ranking-star" },
            active: { leadingPath: "/leagues/:id/standings" },
          },
          {
            href: `/leagues/${id}/players`,
            icon: { name: "people-pulling" },
            label: "Players",
            active: { leadingPath: "/leagues/:id/players" },
          },
          {
            href: `/leagues/${id}/schedule`,
            icon: { name: "people-pulling" },
            label: "Schedule",
            active: { leadingPath: "/leagues/:id/schedule" },
          },
          {
            href: `/leagues/${id}/scores`,
            icon: { name: "people-pulling" },
            label: "Scores",
            active: { leadingPath: "/leagues/:id/scores" },
            visible: hasLeagueRole([LeagueStaffRole.ADMIN, LeagueStaffRole.COMISSIONER]),
          },
        ]}
      >
        {children}
      </DetailPage>
      <LeagueDrawers />
    </>
  );
}
