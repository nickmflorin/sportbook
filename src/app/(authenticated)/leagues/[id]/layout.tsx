import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";
import { type ReactNode } from "react";

import { xprisma, isPrismaDoesNotExistError, isPrismaInvalidIdError, prisma } from "~/prisma/client";
import { type LeagueWithConfig, type FileUpload, type LeagueStaff, LeagueStaffRole } from "~/prisma/model";
import { Badge } from "~/components/badges/Badge";
import { DetailPage } from "~/components/layout/DetailPage";
import { getAuthUser } from "~/server/auth";

import { useUserLeagueStaffRoles } from "./hooks";

const LeagueDrawers = dynamic(() => import("./LeagueDrawers"));

interface LeagueLayoutProps {
  readonly params: { id: string };
  readonly children: ReactNode;
}

export default async function LeagueLayout({ children, params: { id } }: LeagueLayoutProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  let league: LeagueWithConfig & { readonly staff: LeagueStaff[]; readonly teams: { readonly id: string }[] };
  let fileUpload: FileUpload | null;
  let getImage: () => Promise<FileUpload | null>;
  try {
    ({ getImage, ...league } = await xprisma.league.findFirstOrThrow({
      include: { staff: true, config: true, teams: { select: { id: true } } },
      where: {
        id,
        OR: [{ staff: { some: { userId: user.id } } }, { teams: { some: { players: { some: { userId: user.id } } } } }],
      },
    }));
    fileUpload = await getImage();
  } catch (e) {
    if (isPrismaInvalidIdError(e) || isPrismaDoesNotExistError(e)) {
      notFound();
    } else {
      throw e;
    }
  }

  const numPlayers = await prisma.player.count({ where: { teamId: { in: league.teams.map(l => l.id) } } });

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
        tabQueryParams={["teamId"]}
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
