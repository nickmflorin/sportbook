import { icons } from "~/lib/ui";

import { ActionButton, type ActionButtonPolymorphicProps } from "./ActionButton";

export interface EllipsisButtonProps
  extends Omit<ActionButtonPolymorphicProps<"bare">, "icon" | "color" | "hoveredColor" | "focusedColor"> {}

export const EllipsisButton = (props: EllipsisButtonProps) => (
  <ActionButton.Bare
    {...props}
    icon={icons.IconNames.ELLIPSIS}
    color="gray.6"
    hoveredColor="gray.7"
    focusedColor="gray.7"
  />
);
