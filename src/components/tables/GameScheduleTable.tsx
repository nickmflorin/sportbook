"use client";
import { type ModelWithFileUrl, type Game, type Team, type Location } from "~/prisma/model";
import { TeamAvatar } from "~/components/images/TeamAvatar";
import { DateTimeText } from "~/components/typography";

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
  [GameScheduleTableColumn.LOCATION]: {
    title: "Location",
    accessor: "location",
    width: 150,
    render: ({ location }) => (location !== null ? location.name : <></>),
  },
};

export interface GameScheduleTableProps extends Omit<DataTableProps<GameDatum>, "onRowEdit" | "columns"> {
  readonly columns?: GameScheduleTableColumn[];
}

export const GameScheduleTable = ({
  columns = [
    GameScheduleTableColumn.HOME_TEAM,
    GameScheduleTableColumn.AWAY_TEAM,
    GameScheduleTableColumn.TIME,
    GameScheduleTableColumn.LOCATION,
  ],
  ...props
}: GameScheduleTableProps): JSX.Element => (
  <DataTable<GameDatum> {...props} columns={columns.map(name => GameScheduleColumns[name])} />
);

export default GameScheduleTable;
