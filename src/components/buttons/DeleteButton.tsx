import { icons } from "~/lib/ui";

import { BareActionButton, type BareActionButtonProps } from "./BareActionButton";

export type DeleteButtonProps = Omit<BareActionButtonProps, "icon">;

export const DeleteButton = (props: DeleteButtonProps) => (
  <BareActionButton
    {...props}
    icon={icons.IconNames.TRASH_CAN}
    color="red.7"
    hoveredColor="red.8"
    focusedColor="red.8"
  />
);
