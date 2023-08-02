import { type GameStatus, GameStatuses, type Game } from "~/prisma/model";

import { Badge, type BadgeProps } from "./Badge";

type G = Game | GameStatus;

export interface GameStatusBadgeProps extends Omit<BadgeProps, "color" | "backgroundColor" | "children" | "icon"> {
  readonly value: G;
  readonly withIcon?: boolean;
}

const getValue = (value: G): GameStatus => (typeof value === "string" ? value : value.status);

export const GameStatusBadge = ({ value, withIcon, ...props }: GameStatusBadgeProps): JSX.Element => (
  <Badge
    {...props}
    color={GameStatuses.getBadgeColor(getValue(value))}
    backgroundColor={GameStatuses.getBadgeBackgroundColor(getValue(value))}
    outlineColor={GameStatuses.getBadgeBorderColor(getValue(value))}
    iconColor={GameStatuses.getBadgeIconColor(getValue(value))}
    icon={withIcon ? GameStatuses.getIcon(getValue(value)) : undefined}
  >
    {GameStatuses.getLabel(getValue(value))}
  </Badge>
);
