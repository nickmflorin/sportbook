import { prisma } from "~/prisma/client";

interface LeagueTeamsProps {
  readonly params: { id: string };
}

export default async function LeagueTeams({ params: { id } }: LeagueTeamsProps) {
  const teams = await prisma.team.findMany({
    where: { leagueId: id },
  });
  return <h4>{`Teams Count: ${teams.length}`}</h4>;
}
