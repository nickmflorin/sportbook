import { notFound } from "next/navigation";

import { getAuthUser } from "~/lib/auth";
import { isPrismaDoesNotExistError, isPrismaInvalidIdError, type League } from "~/prisma";
import { prisma } from "~/prisma/client";
import { DetailPage } from "~/components/layout";

interface LeagueProps {
  readonly params: { id: string };
}

export default async function League({ params: { id } }: LeagueProps) {
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
      <></>
    </DetailPage>
  );
}
