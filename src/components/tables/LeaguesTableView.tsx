"use client";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [createLeagueDrawerOpen, { open: openLeagueDrawer, close: closeLeaguesDrawer }] = useDisclosure(false);
  const form = hooks.useLeagueForm();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <TableView
        title={title}
        description={description}
        style={style}
        className={className}
        defaultSearch={searchParams.get("query") || undefined}
        onSearch={(q: string) => {
          startTransition(() => {
            if (q.length !== 0) {
              router.push(`/leagues?query=${q}`);
            } else {
              router.push("/leagues");
            }
          });
        }}
        actions={[
          ...(actions || []),
          <SolidButton.Primary key={randomId()} onClick={() => openLeagueDrawer()}>
            Create League
          </SolidButton.Primary>,
        ]}
      >
        <LeaguesTable {...props} data={data} loading={isPending} />
      </TableView>
      <CreateLeagueDrawer
        form={form}
        open={createLeagueDrawerOpen}
        action={async leagueData => {
          await createLeague(leagueData);
          form.reset();
          startTransition(() => {
            router.refresh();
          });
        }}
        onClose={() => closeLeaguesDrawer()}
        onCancel={() => closeLeaguesDrawer()}
      />
    </>
  );
};
