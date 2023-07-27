import { type Team } from "~/prisma/model";

import { Tile, type TileProps } from "./Tile";

type Tm = Pick<Team, "name" | "color"> & {
  readonly fileUrl: string | null;
};

export type TeamTileProps = Omit<TileProps, "title" | "description" | "imageProps"> & {
  readonly team: Tm;
  readonly image?: Omit<TileProps["image"], "url" | "initials">;
};

export const TeamTile = ({ team, ...props }: TeamTileProps): JSX.Element => (
  <Tile {...props} title={team.name} image={{ ...props.image, url: team.fileUrl, initials: team.name }} />
);
