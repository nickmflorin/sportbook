import { notFound, redirect } from "next/navigation";
import { type ReactNode } from "react";

import { xprisma, isPrismaDoesNotExistError, isPrismaInvalidIdError } from "~/prisma/client";
import { type LeagueWithConfig, type FileUpload, type LeagueStaff, LeagueStaffRole } from "~/prisma/model";
import { DetailPage } from "~/components/layout/DetailPage";
import { Flex } from "~/components/structural/Flex";
import { getAuthUser } from "~/server/auth";

import { useUserLeagueStaffRoles } from "./hooks";

interface LeagueLayoutProps {
  readonly params: { id: string };
  readonly scores: ReactNode;
  readonly teams: ReactNode;
  readonly children: ReactNode;
}

export default async function LeagueLayout({ scores, children, teams, params: { id } }: LeagueLayoutProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  let league: LeagueWithConfig & { readonly staff: LeagueStaff[] };
  let fileUpload: FileUpload | null;
  let getImage: () => Promise<FileUpload | null>;
  try {
    ({ getImage, ...league } = await xprisma.league.findFirstOrThrow({
      include: { staff: true, config: true },
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

  const { hasLeagueRole } = await useUserLeagueStaffRoles(user, league);

  return (
    <DetailPage
      title={league.name}
      description={[league.description]}
      headerProps={{
        image: { url: fileUpload === null ? null : fileUpload.fileUrl, initials: league.name },
      }}
      backHref="/leagues"
      backText="All Leagues"
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
      staticViewWidth={420}
      staticViews={
        <Flex direction="column" gap="md" style={{ width: "100%", height: "100%" }}>
          {teams}
          {scores}
        </Flex>
      }
    >
      {children}
    </DetailPage>
  );
}
