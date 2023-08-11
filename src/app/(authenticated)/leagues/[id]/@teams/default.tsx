import { prisma } from "~/prisma/client";
import { FileUploadEntity } from "~/prisma/model";

interface LeagueTeamsProps {
  readonly params: { id: string };
}

export default async function LeagueTeams({ params: { id } }: LeagueTeamsProps) {
  const teams = await prisma.team.findMany({
    where: { leagueId: id },
    orderBy: { createdAt: "desc" }, // Might want to order by the most recent game in the future.
  });
  const imageUploads = await prisma.fileUpload.groupBy({
    by: ["entityId", "fileUrl", "createdAt"],
    where: { entityType: FileUploadEntity.TEAM, id: { in: teams.map(t => t.id) } },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  const teamsWithImage = teams.map(t => ({
    ...t,
    fileUrl: imageUploads.find(i => i.entityId === t.id)?.fileUrl || null,
  }));
  return <></>;
  /* return (
       <TeamTilesView
         contentScrollable={true}
         data={teamsWithImage}
         title={`Teams (${teamsWithImage.length})`}
         renderTileContent={datum => <TeamAvatar size={35} fontSize="xs" team={datum} displayName />}
       />
     ); */
}
