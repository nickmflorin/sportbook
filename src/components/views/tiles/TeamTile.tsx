import { type Team } from "~/prisma/model";

import { Tile, type TileProps } from "./Tile";

type Tm = Pick<Team, "name" | "color"> & {
  readonly fileUrl: string | null;
};

export type TeamTileProps = Omit<TileProps, "title" | "description"> & {
  readonly team: Tm;
};

export const TeamTile = ({ team, ...props }: TeamTileProps): JSX.Element => (
  <Tile {...props} title={team.name} imageSrc={team.fileUrl} fallbackInitials={team.name} />
);
