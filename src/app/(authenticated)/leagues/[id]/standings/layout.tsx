import { Flex } from "~/components/structural/Flex";
import { TableView } from "~/components/views/TableView";
import { TableViewHeader } from "~/components/views/TableViewHeader";
import { View } from "~/components/views/View";
import { ViewHeader } from "~/components/views/ViewHeader";

interface LeagueStandingsLayoutProps {
  readonly standings: React.ReactNode;
  readonly scores: React.ReactNode;
  readonly children: React.ReactNode;
}

export default async function LeagueStandingsLayout({ standings, scores, children }: LeagueStandingsLayoutProps) {
  return (
    <Flex direction="row" gap="md" style={{ width: "100%" }}>
      <TableView header={<TableViewHeader title="Standings" />} style={{ flexGrow: 100 }}>
        {standings}
      </TableView>
      <View contentScrollable={true} header={<ViewHeader title="Scores" />} style={{ maxWidth: 600, minWidth: 400 }}>
        {scores}
      </View>
    </Flex>
  );
}
