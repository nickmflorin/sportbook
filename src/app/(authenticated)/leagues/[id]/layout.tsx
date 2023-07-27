import { notFound, redirect } from "next/navigation";
import { type ReactNode } from "react";

import { xprisma, isPrismaDoesNotExistError, isPrismaInvalidIdError } from "~/prisma/client";
import { type League, type FileUpload } from "~/prisma/model";
import { DetailPage } from "~/components/layout/DetailPage";
import { Flex } from "~/components/structural/Flex";
import { getAuthUser } from "~/server/auth";

interface LeagueLayoutProps {
  readonly params: { id: string };
  readonly scores: ReactNode;
  readonly teams: ReactNode;
  readonly children: ReactNode;
}

export default async function LeagueLayout({ scores, children, teams, params: { id } }: LeagueLayoutProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  let league: League;
  let fileUpload: FileUpload | null;
  let getImage: () => Promise<FileUpload | null>;
  try {
    ({ getImage, ...league } = await xprisma.league.findFirstOrThrow({
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
