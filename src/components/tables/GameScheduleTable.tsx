"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { isServerErrorResponse } from "~/application/errors";
import {
  type ModelWithFileUrl,
  type Game,
  type Team,
  type Location,
  LeaguePermissionCode,
  GameStatus,
} from "~/prisma/model";
import { GameStatusBadge } from "~/components/badges";
import { TeamAvatar } from "~/components/images/TeamAvatar";
import { Loading } from "~/components/loading";
import { type TableAction } from "~/components/menus/TableActionDropdownMenu";
import { DateTimeText } from "~/components/typography/DateTimeText";
import { postponeGame, cancelGame } from "~/app/actions/game";

import { type Column } from "./columns";
import { DataTable, type DataTableProps } from "./DataTable";

const CancelGameForm = dynamic(() => import("~/components/forms/CancelGameForm").then(mod => mod.CancelGameForm), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

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

const GameScheduleColumns: {
  [key in GameScheduleTableColumn]: Column<GameDatum>;
} = {
  [GameScheduleTableColumn.HOME_TEAM]: {
    title: "Home",
    accessor: "homeTeam",
    textAlignment: "left",
    render: (game: GameDatum) => <TeamAvatar team={game.homeTeam} withButton size={30} />,
  },
  [GameScheduleTableColumn.AWAY_TEAM]: {
    title: "Away",
    accessor: "awayTeam",
    textAlignment: "left",
    render: (game: GameDatum) => <TeamAvatar team={game.awayTeam} withButton size={30} />,
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

const hasActionMenu = (permissionCodes?: LeaguePermissionCode[]) =>
  permissionCodes &&
  (permissionCodes.includes(LeaguePermissionCode.CANCEL_GAME) ||
    permissionCodes.includes(LeaguePermissionCode.POSTPONE_GAME));

const actionMenuItems = (
  datum: GameDatum,
  permissionCodes: LeaguePermissionCode[],
  router: ReturnType<typeof useRouter>,
): TableAction<GameDatum>[] => [
  {
    label: "Postpone",
    onClick: async (datum, item) => {
      item.setLoading(true);
      const response = await postponeGame({ id: datum.id });
      item.setLoading(false);
      if (isServerErrorResponse(response)) {
        // TODO: How do we show errors when the error is the result of a menu item click?
        console.error(response);
      } else {
        item.hideSubContent();
        router.refresh();
      }
    },
    visible:
      permissionCodes.includes(LeaguePermissionCode.POSTPONE_GAME) &&
      !([GameStatus.POSTPONED, GameStatus.CANCELLED, GameStatus.PROPOSED] as string[]).includes(datum.status),
  },
  {
    label: "Cancel",
    onClick: async (datum, item) =>
      item.showSubContent(
        <CancelGameForm
          action={async (data, handler) => {
            const response = await cancelGame({ id: datum.id, cancellationReason: data.cancellationReason });
            if (isServerErrorResponse(response)) {
              handler.addServerError(response);
            } else {
              item.hideSubContent();
              router.refresh();
            }
          }}
          onCancel={() => item.hideSubContent()}
        />,
      ),
    visible:
      permissionCodes.includes(LeaguePermissionCode.CANCEL_GAME) &&
      !([GameStatus.CANCELLED, GameStatus.PROPOSED] as string[]).includes(datum.status),
  },
];

const actionMenu = (
  datum: GameDatum,
  router: ReturnType<typeof useRouter>,
  permissionCodes?: LeaguePermissionCode[],
) => {
  if (permissionCodes !== undefined) {
    const items = actionMenuItems(datum, permissionCodes, router);
    return items.filter(i => i.visible !== false && i.hidden !== true);
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
}: GameScheduleTableProps): JSX.Element => {
  const router = useRouter();

  return (
    <DataTable<GameDatum>
      {...props}
      columns={columns.map(name => GameScheduleColumns[name])}
      actionMenu={hasActionMenu(permissionCodes) ? datum => actionMenu(datum, router, permissionCodes) : undefined}
    />
  );
};

export default GameScheduleTable;
