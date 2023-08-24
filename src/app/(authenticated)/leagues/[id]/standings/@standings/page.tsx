import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { getAuthUser } from "~/server/auth";
import { Loading } from "~/components/loading/Loading";

import { getLeagueStandings } from "../../getLeague";

const TeamStandingsTable = dynamic(() => import("~/components/tables/TeamStandingsTable"), {
  loading: () => <Loading loading={true} />,
  ssr: false,
});

interface LeagueStandingsProps {
  readonly params: { id: string };
}

export default async function LeagueStandings({ params: { id } }: LeagueStandingsProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  const standingsWithImages = await getLeagueStandings(id, user);
  return <TeamStandingsTable data={standingsWithImages} />;
}
