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
import { getAuthUser } from "~/server/auth";
import { getTeamStats } from "~/server/leagues";
import { putGameInTeamPerspective } from "~/server/leagues/games";
import { TeamDetailLink } from "~/components/buttons/TeamDetailLink";
import { PlayerAvatar } from "~/components/images/PlayerAvatar";
import { TeamAvatar } from "~/components/images/TeamAvatar";
import { Loading } from "~/components/loading/Loading";
import { Separator } from "~/components/structural/Separator";
import { DateTimeText } from "~/components/typography/DateTimeText";
import { Text } from "~/components/typography/Text";
import { InfoView } from "~/components/views/InfoView";
import { View } from "~/components/views/View";

const DrawerView = dynamic(() => import("~/components/drawers/DrawerView"), {
  loading: () => <Loading loading={true} />,
});

const TeamInfoView = dynamic(() => import("~/components/views/TeamInfoView"), {
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
    <DrawerView header={<TeamInfoView team={{ ...team, stats, numPlayers: team.players.length }} />}>
      <Separator mb="sm" />
      <View
        gap="sm"
        header={<InfoView title="Recent Scores" titleProps={{ order: 6, fontWeight: "medium" }} />}
        contentProps={{ gap: "sm" }}
      >
        {gamesFromPerspective.map((game, i) => (
          <InfoView
            key={i}
            image={
              <TeamAvatar team={game.awayTeamId === team.id ? game.homeTeam : game.awayTeam} fontSize="sm" size={30} />
            }
            title={
              <TeamDetailLink
                team={game.awayTeamId === team.id ? game.homeTeam : game.awayTeam}
                textAlign="left"
                popoverProps={{ withinPortal: true }}
              />
            }
            description={<GameResultScoreText {...game} />}
            rightContent={<DateTimeText value={game.dateTime} textAlign="right" size="xs" justify="flex-end" />}
          />
        ))}
      </View>
      <Separator mb="sm" mt="sm" />
      <View
        header={<InfoView title="Players" titleProps={{ order: 6, fontWeight: "medium" }} />}
        gap="sm"
        contentProps={{ gap: "sm" }}
      >
        {team.players.map((player, i) => (
          <PlayerAvatar key={i} player={player} withButton contentDirection="row" />
        ))}
      </View>
    </DrawerView>
  );
};

export default TeamDrawer;
