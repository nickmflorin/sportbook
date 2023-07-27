"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";

import { type League } from "~/prisma/model";

import { PlayersTable, type PlayersTableProps, type BasePlayer } from "./PlayersTable";
import { TableView, type TableViewProps } from "./TableView";

export interface PlayersTableViewProps<P extends BasePlayer>
  extends Omit<PlayersTableProps<P>, "style" | "className" | "data">,
    Pick<TableViewProps, "title" | "description" | "actions" | "className" | "style"> {
  readonly league: League | string;
  readonly data: P[];
}

export const PlayersTableView = <P extends BasePlayer>({
  data,
  style,
  className,
  title = "Standings",
  description,
  league,
  ...props
}: PlayersTableViewProps<P>): JSX.Element => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const leagueId = typeof league === "string" ? league : league.id;

  return (
    <TableView
      title={title}
      description={description}
      style={style}
      className={className}
      defaultSearch={searchParams.get("query") || undefined}
      onSearch={(q: string) => {
        startTransition(() => {
          if (q.length !== 0) {
            router.push(`/leagues/${leagueId}/players?query=${q}`);
          } else {
            router.push(`/leagues/${leagueId}/players`);
          }
        });
      }}
    >
      <PlayersTable {...props} data={data} loading={isPending} />
    </TableView>
  );
};

export default PlayersTableView;
