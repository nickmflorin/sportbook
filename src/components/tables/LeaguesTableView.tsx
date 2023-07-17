"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

import { randomId, useDisclosure } from "@mantine/hooks";

import { type League } from "~/prisma";
import { SolidButton } from "~/components/buttons";
import { hooks } from "~/components/forms";
import { createLeague } from "~/app/actions/league";

import { LeaguesTable, type LeaguesTableProps } from "./LeaguesTable";
import { TableView, type TableViewProps } from "./TableView";

const CreateLeagueDrawer = dynamic(() =>
  import("~/components/drawers/CreateLeagueDrawer").then(mod => mod.CreateLeagueDrawer),
);

export interface LeaguesTableViewProps
  extends Omit<LeaguesTableProps<League>, "style" | "className" | "sx" | "data">,
    Pick<TableViewProps, "title" | "description" | "actions" | "className" | "style"> {
  readonly data: League[];
}

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
  const [leagues, setLeagues] = useState<League[]>(data);
  const form = hooks.useLeagueForm();

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
        <LeaguesTable {...props} data={leagues} />
      </TableView>
      <CreateLeagueDrawer
        form={form}
        open={createLeagueDrawerOpen}
        action={async leagueData => {
          const result = await createLeague(leagueData);
          form.reset();
          setLeagues((leagues: League[]) => [...leagues, result]);
        }}
        onClose={() => closeLeaguesDrawer()}
        onCancel={() => closeLeaguesDrawer()}
      />
    </>
  );
};
