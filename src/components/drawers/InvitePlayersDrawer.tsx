import dynamic from "next/dynamic";

import type * as z from "zod";

import { type LeagueSchema, type Team, type User } from "~/prisma/model";
import { Loading } from "~/components/loading/Loading";

const InvitePlayersForm = dynamic(() => import("~/components/forms/InvitePlayersForm"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

export type LeagueFormValues = z.output<typeof LeagueSchema>;

export type InvitePlayersFormProps = {
  readonly leagueId: string;
  readonly teams: Team[];
  readonly users: User[];
};

export const InvitePlayersDrawer = ({ leagueId, teams, users }: InvitePlayersFormProps): JSX.Element => (
  <InvitePlayersForm leagueId={leagueId} teams={teams} users={users} />
);

export default InvitePlayersDrawer;
