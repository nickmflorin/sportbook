import { notFound, redirect } from "next/navigation";
import { type ReactNode } from "react";

import { xprisma, isPrismaDoesNotExistError, isPrismaInvalidIdError } from "~/prisma/client";
import { type League, type FileUpload } from "~/prisma/model";
import { DetailPage } from "~/components/layout/DetailPage";
import { getAuthUser } from "~/server/auth";

import css from "./LeagueLayout.module.scss";

interface LeagueLayoutProps {
  readonly params: { id: string };
  readonly scores: ReactNode;
  readonly teams: ReactNode;
  readonly standings: ReactNode;
}

export default async function LeagueLayout({ scores, standings, teams, params: { id } }: LeagueLayoutProps) {
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
      imageSrc={fileUpload === null ? null : fileUpload.fileUrl}
      fallbackInitials={league.name}
      description={[league.description]}
      backHref="/leagues"
    >
      <div className={css["league-layout-page"]}>
        <div className={css["league-layout-page-row"]}>
          <div style={{ flex: 1 }}>{teams}</div>
          <div style={{ flex: 1 }}>{scores}</div>
          <div style={{ flex: 1 }}>{standings}</div>
        </div>
      </div>
    </DetailPage>
  );
}
