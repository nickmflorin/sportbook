import { notFound } from "next/navigation";
import { cache } from "react";

import { xprisma, isPrismaInvalidIdError, isPrismaDoesNotExistError } from "~/prisma/client";
import { type LeagueWithConfig, type LeagueStaff, type User, type FileUpload } from "~/prisma/model";

export const revalidate = 3600; // Revalidate the data at most every hour

type RT = LeagueWithConfig & { readonly staff: LeagueStaff[]; readonly teams: { readonly id: string }[] } & {
  readonly getImage: () => Promise<FileUpload | null>;
};

export const getLeague = cache(async (id: string, user: User): Promise<RT> => {
  let league: RT;
  try {
    league = await xprisma.league.findFirstOrThrow({
      include: { staff: true, config: true, teams: { select: { id: true } } },
      where: {
        id,
        OR: [{ staff: { some: { userId: user.id } } }, { teams: { some: { players: { some: { userId: user.id } } } } }],
      },
    });
  } catch (e) {
    if (isPrismaInvalidIdError(e) || isPrismaDoesNotExistError(e)) {
      notFound();
    } else {
      throw e;
    }
  }
  return league;
});
