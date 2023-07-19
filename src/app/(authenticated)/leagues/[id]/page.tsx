import { notFound } from "next/navigation";

import { logger } from "~/internal/logger";
import { getAuthUser } from "~/lib/auth";
import { isPrismaDoesNotExistError, isPrismaInvalidIdError, type League } from "~/prisma";
import { prisma } from "~/prisma/client";
import { DetailPage } from "~/components/structural/layout";

interface LeagueProps {
  readonly params: { id: string };
}

export default async function League({ params: { id } }: LeagueProps) {
  const user = await getAuthUser({ strict: true });
  let league: League;
  try {
    league = await prisma.league.findUniqueOrThrow({ where: { id } });
  } catch (e) {
    if (isPrismaInvalidIdError(e) || isPrismaDoesNotExistError(e)) {
      notFound();
    } else {
      throw e;
    }
  }
  /* TODO: The actual permissions around a league are going to be different - they will incorporate public/private
     checks, admin checks and things of that nature. */
  if (league.createdById !== user.id) {
    logger.warn(
      { userId: user.id, leagueId: league.id },
      "The user is trying to access a league that they do not have permission to view.",
    );
    notFound();
  }

  return (
    <DetailPage title={league.name} fallbackInitials={league.name} description={[league.description]}>
      <></>
    </DetailPage>
  );
}
