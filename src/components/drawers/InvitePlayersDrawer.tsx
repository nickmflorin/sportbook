"use client";
import * as hooks from "~/components/forms/hooks";
import { InvitePlayersForm } from "~/components/forms/InvitePlayersForm";

export type InvitePlayersFormProps = {
  readonly leagueId: string;
};

export const InvitePlayersDrawer = ({ leagueId }: InvitePlayersFormProps): JSX.Element => {
  const form = hooks.useInvitePlayersForm();
  return <InvitePlayersForm leagueId={leagueId} form={form} />;
};

export default InvitePlayersDrawer;
