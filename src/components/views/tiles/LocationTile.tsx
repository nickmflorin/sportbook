import { type Location } from "~/prisma/model";

import { Tile, type TileProps } from "./Tile";

type Loc = Pick<Location, "name" | "primaryStreetAddress" | "description">;

export type LocationTileProps = Omit<TileProps, "title" | "description"> & {
  readonly location: Loc;
};

export const LocationTile = ({ location, ...props }: LocationTileProps): JSX.Element => (
  <Tile {...props} description={[location.description, location.primaryStreetAddress]} title={location.name} />
);
