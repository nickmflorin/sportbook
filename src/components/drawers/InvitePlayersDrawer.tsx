"use client";
import type * as z from "zod";

import * as hooks from "~/components/forms/hooks";
import { InvitePlayersForm } from "~/components/forms/InvitePlayersForm";
import { type LeagueSchema, type Team, type User } from "~/prisma/model";

export type LeagueFormValues = z.output<typeof LeagueSchema>;

export type InvitePlayersFormProps = {
  readonly leagueId: string;
  readonly teams: Team[];
  readonly users: User[];
};

export const InvitePlayersDrawer = ({ leagueId, teams, users }: InvitePlayersFormProps): JSX.Element => {
  const form = hooks.useInvitePlayersForm();
  return <InvitePlayersForm leagueId={leagueId} teams={teams} users={users} form={form} />;
};

export default InvitePlayersDrawer;
