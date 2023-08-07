"use client";
import React from "react";

import type * as z from "zod";

import { type LeagueSchema, type Team, type Player, type User } from "~/prisma/model";
import { View } from "~/components/views/View";
import { useMutableSearchParams } from "~/hooks/useMutableSearchParams";

import { PlayerAvatar } from "../images/PlayerAvatar";
import { TeamAvatar } from "../images/TeamAvatar";

import { DrawerView } from "./DrawerView";

export type LeagueFormValues = z.output<typeof LeagueSchema>;

export type TeamDrawerProps = {
  readonly team: Team & { readonly players: (Player & { readonly user: User })[] };
};

export const TeamDrawer = ({ team }: TeamDrawerProps): JSX.Element => {
  const { updateParams } = useMutableSearchParams();
  const { path } = updateParams({ teamId: team.id, drawerId: "leagueTeam" });
  return (
    <DrawerView
      title={team.name}
      onClose={() => updateParams({ drawerId: null }, { push: true })}
      image={<TeamAvatar team={team} href={path} />}
      style={{ minWidth: 320 }}
    >
      <View title="Players" gap="sm" headerProps={{ titleProps: { order: 6 } }} contentProps={{ gap: "sm" }}>
        {team.players.map((player, i) => (
          <PlayerAvatar key={i} player={player} contentDirection="row" />
        ))}
      </View>
    </DrawerView>
  );
};

export default TeamDrawer;
