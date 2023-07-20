import { type Location } from "~/prisma/model";

import { ModelTile, type ModelTileProps } from "./ModelTile";

type Loc = Pick<Location, "name" | "primaryStreetAddress" | "description">;

export type LocationTileProps = Omit<ModelTileProps<Loc>, "title" | "description">;

export const LocationTile = (props: LocationTileProps): JSX.Element => (
  <ModelTile {...props} description={(l: Loc) => l.description || l.primaryStreetAddress} title="name" />
);
