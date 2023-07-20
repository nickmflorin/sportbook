import { prisma } from "~/prisma/client";

interface LeagueGamesProps {
  readonly params: { id: string };
}

export default async function LeagueGames({ params: { id } }: LeagueGamesProps) {
  const games = await prisma.game.findMany({
    where: { leagueId: id },
  });
  return <h4>{`Games Count: ${games.length}`}</h4>;
}
