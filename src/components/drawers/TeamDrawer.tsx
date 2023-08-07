"use client";
import React from "react";

import type * as z from "zod";

import { type LeagueSchema, type Team } from "~/prisma/model";
import { useMutableSearchParams } from "~/hooks/useMutableSearchParams";

import { DrawerView } from "./DrawerView";

export type LeagueFormValues = z.output<typeof LeagueSchema>;

export type TeamDrawerProps = {
  readonly team: Team;
};

export const TeamDrawer = ({ team }: TeamDrawerProps): JSX.Element => {
  const { updateParams } = useMutableSearchParams();

  return (
    <DrawerView
      title="Create a New League"
      description="Configure your league however you would like."
      onClose={() => updateParams({ drawerId: null }, { push: true })}
    >
      <p>{team.name}</p>
    </DrawerView>
  );
};

export default TeamDrawer;
