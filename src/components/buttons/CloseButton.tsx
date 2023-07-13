import { icons } from "~/lib/ui";

import { BareActionButton, type BareActionButtonProps } from "./BareActionButton";

export type CloseButtonProps = Omit<BareActionButtonProps, "icon">;

export const CloseButton = (props: CloseButtonProps) => (
  <BareActionButton
    {...props}
    icon={icons.IconNames.XMARK}
    color="gray.7"
    hoveredColor="gray.8"
    focusedColor="gray.8"
  />
);
