import { notFound } from "next/navigation";
import { type ReactNode } from "react";

import { getAuthUser } from "~/lib/auth";
import { prisma, isPrismaDoesNotExistError, isPrismaInvalidIdError } from "~/prisma/client";
import { type League } from "~/prisma/model";
import { DetailPage } from "~/components/layout";
import { Flex } from "~/components/structural";
import { Block } from "~/components/views/blocks/Block";

import css from "./LeagueLayout.module.scss";

interface LeagueLayoutProps {
  readonly params: { id: string };
  readonly games: ReactNode;
  readonly teams: ReactNode;
}

export default async function LeagueLayout({ games, teams, params: { id } }: LeagueLayoutProps) {
  const user = await getAuthUser({ strict: true });
  let league: League;
  try {
    league = await prisma.league.findFirstOrThrow({
      where: { id, participants: { some: { participantId: user.id } } },
    });
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
      fallbackInitials={league.name}
      description={[league.description]}
      backHref="/leagues"
    >
      <div className={css["league-layout-page"]}>
        <div className={css["league-layout-page-row"]}>
          <Block style={{ flex: 1 }}>{games}</Block>
          <Block style={{ flex: 1 }}>{teams}</Block>
        </div>
      </div>
    </DetailPage>
  );
}
