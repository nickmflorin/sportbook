import dynamic from "next/dynamic";
import React from "react";

import { logger } from "~/application/logger";
import { isUuid } from "~/lib/schemas";
import { parseUserDisplayName } from "~/lib/user";
import { prisma } from "~/prisma/client";
import { LeaguePlayerTypeBadge } from "~/components/badges/LeaguePlayerTypeBadge";
import { PlayerAvatar } from "~/components/images/PlayerAvatar";
import { Loading } from "~/components/loading/Loading";
import { getAuthUser } from "~/server/auth";

const DrawerView = dynamic(() => import("~/components/drawers/DrawerView"), {
  loading: () => <Loading loading={true} />,
});

export type PlayerDrawerProps = {
  readonly playerId: string;
};

export const PlayerDrawer = async ({ playerId }: PlayerDrawerProps): Promise<JSX.Element | null> => {
  const user = await getAuthUser({ strict: true });

  /* Note: We could just as easily allow the prisma queries to throw an error due to an invalid ID in the case that it
     is not a valid UUID - but this saves us an additional queries to the database. Ideally, the ID that is passed in
     should be a valid player ID, but just in case it's source is a query param it is best to validate here. */
  if (!isUuid(playerId)) {
    logger.error({ playerId }, `The value '${playerId}' for the 'playerId' prop is not a valid UUID...`);
    return null;
  }

  const player = await prisma.player.findFirstOrThrow({
    where: {
      id: playerId,
      /* Instead of using the 'findUniqueOrThrow' method, we should use the 'findFirstOrThrow' method so we can ensure
         that the player belongs to a league that the currently logged in user has the permissions to view.  This may
         eventually change - but for now it is a permissions-based requirement. */
      team: {
        league: {
          OR: [
            { staff: { some: { userId: user.id } } },
            { teams: { some: { players: { some: { userId: user.id } } } } },
          ],
        },
      },
    },
    include: { user: true, team: true },
  });

  return (
    <DrawerView
      title={parseUserDisplayName(player.user) || ""}
      headerProps={{
        image: <PlayerAvatar player={player} fontSize="sm" size={50} />,
        tags: [<LeaguePlayerTypeBadge key="0" size="xxs" value={player.playerType} />],
      }}
    >
      <></>
    </DrawerView>
  );
};

export default PlayerDrawer;