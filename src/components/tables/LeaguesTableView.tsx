"use client";
import dynamic from "next/dynamic";
import { experimental_useOptimistic as useOptimistic } from "react";

import { useDisclosure } from "@mantine/hooks";

import { PrimaryButton } from "~/components/buttons";
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
    (state, newLeague) => [...state, newLeague],
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
          <PrimaryButton key={actions.length + 1} onClick={() => openLeagueDrawer()}>
            Create League
          </PrimaryButton>,
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
