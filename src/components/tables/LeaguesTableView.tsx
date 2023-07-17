"use client";
import dynamic from "next/dynamic";
import { experimental_useOptimistic as useOptimistic } from "react";

import { randomId, useDisclosure } from "@mantine/hooks";

import { SolidButton } from "~/components/buttons";
import { createLeague } from "~/app/actions/league";

import { LeaguesTable, type LeaguesTableProps, type LeagueDatum } from "./LeaguesTable";
import { TableView, type TableViewProps } from "./TableView";

const CreateLeagueDrawer = dynamic(() =>
  import("~/components/drawers/CreateLeagueDrawer").then(mod => mod.CreateLeagueDrawer),
);

export interface LeaguesTableViewProps
  extends Omit<LeaguesTableProps<LeagueDatum>, "style" | "className" | "sx">,
    Pick<TableViewProps, "title" | "description" | "actions" | "className" | "style"> {}

export const LeaguesTableView = ({
  data,
  style,
  className,
  title = "Leagues",
  description,
  actions = [],
  ...props
}: LeaguesTableViewProps): JSX.Element => {
  const [createLeagueDrawerOpen, { open: openLeagueDrawer, close: closeLeaguesDrawer }] = useDisclosure(false);
  const [optimisticLeagues, addOptimisticLeague] = useOptimistic<LeagueDatum[], LeagueDatum>(
    data,
    // Unsaved optimistically added rows need to be given an ID to avoid unique key errors w React.
    (state, newLeague) => [...state, { id: `unsaved-league-${randomId()}`, ...newLeague }],
  );
  return (
    <>
      <TableView
        title={title}
        description={description}
        style={style}
        className={className}
        actions={[
          ...(actions || []),
          <SolidButton.Primary key={randomId()} onClick={() => openLeagueDrawer()}>
            Create League
          </SolidButton.Primary>,
        ]}
      >
        <LeaguesTable {...props} data={optimisticLeagues} />
      </TableView>
      <CreateLeagueDrawer
        open={createLeagueDrawerOpen}
        action={async data => {
          addOptimisticLeague(data);
          await createLeague(data);
        }}
        onClose={() => closeLeaguesDrawer()}
        onCancel={() => closeLeaguesDrawer()}
      />
    </>
  );
};
