import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { getAuthUser } from "~/server/auth";
import { parseQueryTeamIds } from "~/server/urls";
import { Loading } from "~/components/loading/Loading";

import { getPlayers } from "./getPlayers";

const PlayersTable = dynamic(() => import("~/components/tables/PlayersTable"), {
  loading: () => <Loading loading={true} />,
  ssr: false, // Avoids hydration mismatch with the icons... might need to be revisited in the future.
});

interface LeaguePlayersProps {
  readonly params: { id: string };
  readonly searchParams: { search?: string; teams?: string };
}

export default async function LeaguePlayers({
  params: { id },
  searchParams: { search: _search, teams },
}: LeaguePlayersProps) {
  const search: string = _search !== undefined ? decodeURIComponent(_search) : "";
  const teamIds = await parseQueryTeamIds({ value: teams });

  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });

  const players = await getPlayers({ user, search, teamIds, leagueId: id });
  return <PlayersTable data={players} />;
}
