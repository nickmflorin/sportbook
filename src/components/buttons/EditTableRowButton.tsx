import { icons } from "~/lib/ui";

import { ActionButton, type ActionButtonPolymorphicProps } from "./ActionButton";

export interface EditTableRowButtonProps
  extends Omit<ActionButtonPolymorphicProps<"bare">, "icon" | "color" | "hoveredColor" | "focusedColor"> {}

export const EditTableRowButton = (props: EditTableRowButtonProps) => (
  <ActionButton.Bare
    {...props}
    icon={icons.IconNames.PEN_TO_SQUARE}
    color="blue.12"
    hoveredColor="blue.14"
    focusedColor="blue.14"
  />
);
