import { ScoreTile } from "~/components/views/tiles/ScoreTile";
import { TilesWrapper } from "~/components/views/TilesWrapper";

import { getLeagueScores } from "../../getLeague";

interface LeagueScoresProps {
  readonly params: { id: string };
}

export default async function LeagueScores({ params: { id } }: LeagueScoresProps) {
  const gamesWithResult = await getLeagueScores(id);
  return <TilesWrapper data={gamesWithResult}>{({ datum }) => <ScoreTile game={datum} />}</TilesWrapper>;
}
