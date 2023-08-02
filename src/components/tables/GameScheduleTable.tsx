"use client";
import { type ModelWithFileUrl, type Game, type Team, type Location, LeaguePermissionCode } from "~/prisma/model";
import { GameStatusBadge } from "~/components/badges";
import { TeamAvatar } from "~/components/images/TeamAvatar";
import { DateTimeText } from "~/components/typography/DateTimeText";

import { DataTable, type DataTableProps, type Column } from "./DataTable";

type GameDatum = Game & {
  readonly homeTeam: ModelWithFileUrl<Team>;
  readonly awayTeam: ModelWithFileUrl<Team>;
  readonly location: Location | null;
};

export enum GameScheduleTableColumn {
  HOME_TEAM,
  AWAY_TEAM,
  TIME,
  STATUS,
  LOCATION,
}

const GameScheduleColumns: { [key in GameScheduleTableColumn]: Column<GameDatum> } = {
  [GameScheduleTableColumn.HOME_TEAM]: {
    title: "Home",
    accessor: "homeTeam",
    textAlignment: "left",
    render: (game: GameDatum) => <TeamAvatar team={game.homeTeam} size={30} displayName={true} />,
  },
  [GameScheduleTableColumn.AWAY_TEAM]: {
    title: "Away",
    accessor: "awayTeam",
    textAlignment: "left",
    render: (game: GameDatum) => <TeamAvatar team={game.awayTeam} size={30} displayName={true} />,
  },
  [GameScheduleTableColumn.TIME]: {
    title: "Time",
    accessor: "dateTime",
    width: 150,
    render: ({ dateTime }) => <DateTimeText value={dateTime} />,
  },
  [GameScheduleTableColumn.STATUS]: {
    title: "Status",
    accessor: "status",
    width: 150,
    render: ({ status }) => <GameStatusBadge value={status} withIcon={true} size="xs" />,
  },
  [GameScheduleTableColumn.LOCATION]: {
    title: "Location",
    accessor: "location",
    width: 150,
    render: ({ location }) => (location !== null ? location.name : <></>),
  },
};

export interface GameScheduleTableProps extends Omit<DataTableProps<GameDatum>, "onRowEdit" | "columns"> {
  readonly columns?: GameScheduleTableColumn[];
  readonly permissionCodes?: LeaguePermissionCode[];
}

const actionMenuItems = (permissionCodes: LeaguePermissionCode[]) => {
  if (
    permissionCodes.includes(LeaguePermissionCode.CANCEL_GAME) ||
    permissionCodes.includes(LeaguePermissionCode.POSTPONE_GAME)
  ) {
    return [
      {
        label: "Postpone",
        onClick: () => console.log("Postpone"),
        hidden: !permissionCodes.includes(LeaguePermissionCode.POSTPONE_GAME),
      },
      {
        label: "Cancel",
        onClick: () => console.log("Cancel"),
        hidden: !permissionCodes.includes(LeaguePermissionCode.CANCEL_GAME),
      },
    ];
  }
  return [];
};

const actionMenu = (permissionCodes?: LeaguePermissionCode[]) => {
  if (permissionCodes !== undefined) {
    const items = actionMenuItems(permissionCodes);
    if (items.length === 0 || items.every(i => i.hidden)) {
      return undefined;
    }
    return items;
  }
  return undefined;
};

export const GameScheduleTable = ({
  columns = [
    GameScheduleTableColumn.HOME_TEAM,
    GameScheduleTableColumn.AWAY_TEAM,
    GameScheduleTableColumn.STATUS,
    GameScheduleTableColumn.TIME,
    GameScheduleTableColumn.LOCATION,
  ],
  permissionCodes,
  ...props
}: GameScheduleTableProps): JSX.Element => (
  <DataTable<GameDatum>
    {...props}
    columns={columns.map(name => GameScheduleColumns[name])}
    actionMenu={actionMenu(permissionCodes)}
  />
);

export default GameScheduleTable;
