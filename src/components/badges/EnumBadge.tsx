import { type Optional } from "utility-types";

import { type ColorProps } from "~/lib/ui";
import { type PrismaEnum, type PrismaEnumValue, type EnumModel } from "~/prisma/model";

import { Badge, type BadgeProps } from "./Badge";

export type EnumBadgeProps<E extends PrismaEnum> = Omit<
  Optional<BadgeProps, Extract<keyof ColorProps, keyof BadgeProps> | "icon" | "iconColor">,
  "children"
> & {
  readonly model: EnumModel<E>;
  readonly value: PrismaEnumValue<E>;
  readonly withIcon?: boolean;
};

export const EnumBadge = <E extends PrismaEnum>({ model, withIcon, value, ...props }: EnumBadgeProps<E>) => (
  <Badge
    color={model.getBadgeColor(value)}
    backgroundColor={model.getBadgeBackgroundColor(value)}
    outlineColor={model.getBadgeBorderColor(value)}
    iconColor={model.getBadgeIconColor(value)}
    icon={withIcon ? model.getIcon(value) : undefined}
    {...props}
  >
    {model.getLabel(value)}
  </Badge>
);
