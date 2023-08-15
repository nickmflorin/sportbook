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
  readonly teams: Team[];
  readonly users: User[];
};

export const InvitePlayersDrawer = ({ teams, users }: InvitePlayersFormProps): JSX.Element => (
  <InvitePlayersForm teams={teams} users={users} />
);

export default InvitePlayersDrawer;
