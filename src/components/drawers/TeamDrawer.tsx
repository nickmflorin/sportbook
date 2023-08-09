"use client";
import React from "react";

import type * as z from "zod";

import { type LeagueSchema, type Team, type Player, type User, type TeamStats } from "~/prisma/model";
import { Badge } from "~/components/badges/Badge";
import { PlayerAvatar } from "~/components/images/PlayerAvatar";
import { TeamAvatar } from "~/components/images/TeamAvatar";
import { Separator } from "~/components/structural/Separator";
import { TeamStatsText } from "~/components/typography/TeamStatsText";
import { Text } from "~/components/typography/Text";
import { View } from "~/components/views/View";
import { useMutableSearchParams } from "~/hooks/useMutableSearchParams";

import { DrawerView } from "./DrawerView";

export type LeagueFormValues = z.output<typeof LeagueSchema>;

export type TeamDrawerProps = {
  readonly stats: TeamStats;
  readonly team: Team & { readonly players: (Player & { readonly user: User })[] };
};

export const TeamDrawer = ({ team, stats }: TeamDrawerProps): JSX.Element => {
  const { updateParams } = useMutableSearchParams();
  const { path } = updateParams({ teamId: team.id, drawerId: "leagueTeam" });
  return (
    <DrawerView
      title={team.name}
      onClose={() => updateParams({ drawerId: null }, { push: true })}
      description={[<TeamStatsText key="0" stats={stats} size="xs" />]}
      headerProps={{
        image: <TeamAvatar team={team} href={path} fontSize="sm" size={50} />,
        tags: [<Badge key="0" size="xxs">{`${team.players.length} Players`}</Badge>],
      }}
      style={{ minWidth: 320 }}
    >
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
};

export default TeamDrawer;
