import { notFound } from "next/navigation";
import { type ReactNode } from "react";

import { getAuthUser } from "~/lib/auth";
import { isPrismaDoesNotExistError, isPrismaInvalidIdError, type League } from "~/prisma";
import { prisma } from "~/prisma/client";
import { DetailPage } from "~/components/layout";
import { Flex } from "~/components/structural";

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
    <DetailPage title={league.name} fallbackInitials={league.name} description={[league.description]}>
      <Flex direction="row">
        {games}
        {teams}
      </Flex>
    </DetailPage>
  );
}
