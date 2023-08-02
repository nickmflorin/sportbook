import { type ColorProps } from "~/lib/ui";
import { type PrismaEnum, type PrismaEnumValue, type EnumModel } from "~/prisma/model";

import { Badge, type BadgeProps } from "./Badge";

export type EnumBadgeProps<E extends PrismaEnum> = Omit<
  BadgeProps,
  keyof ColorProps | "icon" | "iconColor" | "children"
> & {
  readonly model: EnumModel<E>;
  readonly value: PrismaEnumValue<E>;
  readonly withIcon?: boolean;
};

export const EnumBadge = <E extends PrismaEnum>({ model, withIcon, value, ...props }: EnumBadgeProps<E>) => (
  <Badge
    {...props}
    color={model.getBadgeColor(value)}
    backgroundColor={model.getBadgeBackgroundColor(value)}
    outlineColor={model.getBadgeBorderColor(value)}
    iconColor={model.getBadgeIconColor(value)}
    icon={withIcon ? model.getIcon(value) : undefined}
  >
    {model.getLabel(value)}
  </Badge>
);
