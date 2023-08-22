import { Flex } from "~/components/structural/Flex";
import { InfoView } from "~/components/views/InfoView";
import { TableView } from "~/components/views/TableView";
import { View } from "~/components/views/View";

interface LeagueStandingsLayoutProps {
  readonly standings: React.ReactNode;
  readonly scores: React.ReactNode;
  readonly children: React.ReactNode;
}

export default async function LeagueStandingsLayout({ standings, scores, children }: LeagueStandingsLayoutProps) {
  return (
    <Flex direction="row" gap="md" style={{ width: "100%" }}>
      <TableView header={<InfoView title="Standings" />} style={{ flexGrow: 100 }}>
        {standings}
      </TableView>
      <View contentScrollable={true} header={<InfoView title="Scores" />} style={{ maxWidth: 600, minWidth: 400 }}>
        {scores}
      </View>
      {children}
    </Flex>
  );
}
