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
      where: { id, participants: { some: { participantId: user.id } } },
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
        imageProps: { src: fileUpload === null ? null : fileUpload.fileUrl, fallbackInitials: league.name },
      }}
      backHref="/leagues"
      tabs={[
        {
          label: "Standings",
          href: "/standings",
          icon: { name: "house-chimney" },
          active: { leadingPath: "/leagues/:id/standings" },
        },
        {
          href: "/players",
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
