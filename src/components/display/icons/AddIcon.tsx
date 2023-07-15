import { icons } from "~/lib/ui";

import { Icon } from "./Icon";

export type AddIconProps = Omit<icons.IconProps, "icon" | "color">;

export const AddIcon = (props: AddIconProps) => (
  <Icon {...props} icon={icons.IconNames.CIRCLE_PLUS} color="green.7" hoveredColor="green.8" focusedColor="green.8" />
);
