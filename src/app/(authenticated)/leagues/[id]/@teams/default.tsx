import dynamic from "next/dynamic";

import { prisma } from "~/prisma/client";
import { FileUploadEntity } from "~/prisma/model";
import { ModelImage } from "~/components/images";
import { Loading } from "~/components/loading";
import { Flex } from "~/components/structural/Flex";
import { Text } from "~/components/typography";

const TeamTilesView = dynamic(() => import("~/components/views/TeamTilesView"), {
  ssr: true,
  loading: () => <Loading loading={true} />,
});

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
  return (
    <TeamTilesView
      contentScrollable={true}
      data={teamsWithImage}
      title={`Teams (${teamsWithImage.length})`}
      renderTileContent={datum => (
        <Flex direction="row" gap="md">
          <ModelImage size={35} fontSize="xs" src={datum.fileUrl} fallbackInitials={datum.name} />
          <Text size="md">{datum.name}</Text>
        </Flex>
      )}
    />
  );
}
