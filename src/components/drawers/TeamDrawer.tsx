import dynamic from "next/dynamic";
import React from "react";

import { prisma, isPrismaInvalidIdError } from "~/prisma/client";
import { type Team, type Player, type User, type Game, type GameResult } from "~/prisma/model";
import { Badge } from "~/components/badges/Badge";
import { PlayerAvatar } from "~/components/images/PlayerAvatar";
import { TeamAvatar } from "~/components/images/TeamAvatar";
import { Loading } from "~/components/loading/Loading";
import { Separator } from "~/components/structural/Separator";
import { TeamStatsText } from "~/components/typography/TeamStatsText";
import { View } from "~/components/views/View";
import { getAuthUser } from "~/server/auth";
import { getTeamStats } from "~/server/leagues";

const DrawerView = dynamic(() => import("~/components/drawers/DrawerView"), {
  loading: () => <Loading loading={true} />,
});

export type TeamDrawerProps = {
  readonly teamId: string;
};

type Tm = Team & {
  readonly awayGames: (Game & { readonly homeTeam: Team; readonly result: GameResult | null })[];
  readonly homeGames: (Game & { readonly awayTeam: Team; readonly result: GameResult | null })[];
  readonly players: (Player & { readonly user: User })[];
};

export const TeamDrawer = async ({ teamId }: TeamDrawerProps): Promise<JSX.Element | null> => {
  const user = await getAuthUser({ strict: true });
  let team: Tm | null = null;
  try {
    // Prisma does not recognize that the result will be non-null in the resulting type.
    team = await prisma.team.findFirst({
      include: {
        players: { include: { user: true } },
        league: { include: { teams: true } },
        awayGames: { where: { result: { isNot: null } }, include: { homeTeam: true, result: true } },
        homeGames: { where: { result: { isNot: null } }, include: { awayTeam: true, result: true } },
      },
      where: {
        id: teamId,
        league: {
          OR: [
            { staff: { some: { userId: user.id } } },
            { teams: { some: { players: { some: { userId: user.id } } } } },
          ],
        },
      },
    });
  } catch (e) {
    if (!isPrismaInvalidIdError(e)) {
      throw e;
    }
  }
  if (team) {
    const stats = await getTeamStats(team);
    return (
      <DrawerView
        title={team.name}
        description={[<TeamStatsText key="0" stats={stats} size="xs" />]}
        headerProps={{
          image: <TeamAvatar team={team} fontSize="sm" size={50} />,
          tags: [<Badge key="0" size="xxs">{`${team.players.length} Players`}</Badge>],
        }}
      >
        <Separator mb="sm" />
        <View
          title="Recent Scores"
          gap="sm"
          headerProps={{ titleProps: { order: 6, fontWeight: "medium" } }}
          contentProps={{ gap: "sm" }}
        >
          {team.players.map((player, i) => (
            <PlayerAvatar key={i} player={player} contentDirection="row" />
          ))}
        </View>
        <Separator mb="sm" />
        <View
          title="Players"
          gap="sm"
          headerProps={{ titleProps: { order: 6, fontWeight: "medium" } }}
          contentProps={{ gap: "sm" }}
        >
          {team.players.map((player, i) => (
            <PlayerAvatar key={i} player={player} contentDirection="row" />
          ))}
        </View>
      </DrawerView>
    );
  }
  return null;
};

export default TeamDrawer;
