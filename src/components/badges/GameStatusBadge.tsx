import { type GameStatus, GameStatuses, type Game } from "~/prisma/model";

import { EnumBadge, type EnumBadgeProps } from "./EnumBadge";

type G = Game | GameStatus;

export interface GameStatusBadgeProps extends Omit<EnumBadgeProps<typeof GameStatus>, "value"> {
  readonly value: G;
}

const getValue = (value: G): GameStatus => (typeof value === "string" ? value : value.status);

export const GameStatusBadge = ({ value, ...props }: GameStatusBadgeProps): JSX.Element => (
  <EnumBadge {...props} model={GameStatuses} value={getValue(value)} />
);
