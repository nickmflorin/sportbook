import dynamic from "next/dynamic";

import { Flex } from "~/components/structural/Flex";

const TableView = dynamic(() => import("~/components/views/TableView"), { ssr: false });
const View = dynamic(() => import("~/components/views/View"), { ssr: false });
const InfoView = dynamic(() => import("~/components/views/InfoView"), { ssr: false });

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
