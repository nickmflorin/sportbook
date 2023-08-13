import dynamic from "next/dynamic";
import React from "react";

import { logger } from "~/application/logger";
import { isUuid } from "~/lib/schemas";
import { prisma } from "~/prisma/client";
import {
  type TeamStats,
  type TeamWithPlayers,
  GameResultType,
  GameResultTypes,
  type GameWithTeams,
  type TeamGameWithOpponent,
} from "~/prisma/model";
import { Badge } from "~/components/badges/Badge";
import { TeamButton } from "~/components/buttons/TeamButton";
import { PlayerAvatar } from "~/components/images/PlayerAvatar";
import { TeamAvatar } from "~/components/images/TeamAvatar";
import { Loading } from "~/components/loading/Loading";
import { Separator } from "~/components/structural/Separator";
import { DateTimeText } from "~/components/typography/DateTimeText";
import { TeamStatsText } from "~/components/typography/TeamStatsText";
import { Text } from "~/components/typography/Text";
import { InfoView } from "~/components/views/InfoView";
import { View } from "~/components/views/View";
import { getAuthUser } from "~/server/auth";
import { getTeamStats } from "~/server/leagues";
import { putGameInTeamPerspective } from "~/server/leagues/games";

const DrawerView = dynamic(() => import("~/components/drawers/DrawerView"), {
  loading: () => <Loading loading={true} />,
});

export type TeamDrawerProps = {
  readonly teamId: string;
};

const GameResultScoreText = (game: TeamGameWithOpponent): JSX.Element => {
  switch (game.resultType) {
    case GameResultType.WIN:
      return (
        <Text size="xs" color="gray.6">
          <Text span>{GameResultTypes.getLabel(game.resultType)}</Text>
          <Text color="gray.8" span ml="xs" fontWeight="medium">
            {game.score}
          </Text>
          <Text span ml="xxs" fontWeight="medium">
            -
          </Text>
          <Text color="gray.6" span ml="xxs" fontWeight="medium">
            {game.opponentScore}
          </Text>
        </Text>
      );
    case GameResultType.LOSS:
      return (
        <Text size="xs" color="gray.6">
          <Text span>{GameResultTypes.getLabel(game.resultType)}</Text>
          <Text color="gray.6" span ml="xs" fontWeight="medium">
            {game.opponentScore}
          </Text>
          <Text span ml="xxs" fontWeight="medium">
            -
          </Text>
          <Text color="gray.8" span ml="xxs" fontWeight="medium">
            {game.score}
          </Text>
        </Text>
      );
    case GameResultType.TIE:
      return (
        <Text size="xs" color="gray.6">
          <Text span>{GameResultTypes.getLabel(game.resultType)}</Text>
          <Text color="gray.7" span ml="xs" fontWeight="medium">
            {game.opponentScore}
          </Text>
          <Text span ml="xxs" fontWeight="medium">
            -
          </Text>
          <Text color="gray.7" span ml="xxs" fontWeight="medium">
            {game.score}
          </Text>
        </Text>
      );
    default:
      throw new Error(`Invalid game result type '${game.resultType}'!`);
  }
};

export const TeamDrawer = async ({ teamId }: TeamDrawerProps): Promise<JSX.Element | null> => {
  const user = await getAuthUser({ strict: true });

  /* Note: We could just as easily allow the prisma queries to throw an error due to an invalid ID in the case that it
     is not a valid UUID - but this saves us an additional two queries to the database (one for the team, one for the
     games).  Ideally, the ID that is passed in should be a valid team ID, but just in case it's source is a query param
     it is best to validate here. */
  if (!isUuid(teamId)) {
    logger.error({ teamId }, `The value '${teamId}' for the 'teamId' prop is not a valid UUID...`);
    return null;
  }
  const queries: [Promise<TeamWithPlayers | null>, Promise<GameWithTeams[]>, Promise<TeamStats | null>] = [
    prisma.team.findFirst({
      include: {
        players: { include: { user: true } },
        league: { include: { teams: true } },
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
    }),
    prisma.game.findMany({
      where: {
        result: { isNot: null },
        OR: [{ awayTeamId: teamId }, { homeTeamId: teamId }],
      },
      orderBy: { dateTime: "desc" },
      take: 5,
      include: { homeTeam: true, awayTeam: true, result: true },
      // We have to coerce here because the Prisma query does not seem to recognize that the result will be non-null.
    }) as Promise<GameWithTeams[]>,
    getTeamStats(teamId, { strict: false }),
  ];

  const [team, games, stats] = await Promise.all(queries);
  if (!team) {
    logger.error({ teamId }, `The value '${teamId}' for the 'teamId' prop is not associated with a team...`);
    return null;
  } else if (!stats) {
    logger.error(
      { teamId },
      `The team's stats could not be retrieved, the value '${teamId}' for the 'teamId' prop is not associated with a team...`,
    );
    return null;
  }

  const gamesFromPerspective = games.map(g => putGameInTeamPerspective(team.id, g));

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
        {gamesFromPerspective.map((game, i) => (
          <InfoView
            key={i}
            image={
              <TeamAvatar team={game.awayTeamId === team.id ? game.homeTeam : game.awayTeam} fontSize="sm" size={30} />
            }
            title={<TeamButton team={team} textAlign="left" />}
            description={<GameResultScoreText {...game} />}
            rightContent={<DateTimeText value={game.dateTime} textAlign="right" size="xs" justify="flex-end" />}
          />
        ))}
      </View>
      <Separator mb="sm" mt="sm" />
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
};

export default TeamDrawer;
