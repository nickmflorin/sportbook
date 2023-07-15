import { icons } from "~/lib/ui";

import { BareActionButton, type BareActionButtonProps } from "./BareActionButton";

export type AddButtonProps = Omit<BareActionButtonProps, "icon">;

export const AddButton = (props: AddButtonProps) => (
  <BareActionButton
    {...props}
    icon={icons.IconNames.CIRCLE_PLUS}
    color="green.7"
    hoveredColor="green.8"
    focusedColor="green.8"
  />
);
