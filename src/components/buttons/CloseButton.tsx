import { icons } from "~/lib/ui";

import { ActionButton, type ActionButtonPolymorphicProps } from "./ActionButton";

export type CloseButtonProps = Omit<ActionButtonPolymorphicProps<"bare">, "icon">;

export const CloseButton = (props: CloseButtonProps) => (
  <ActionButton.Bare
    {...props}
    icon={icons.IconNames.XMARK}
    color="gray.7"
    hoveredColor="gray.8"
    focusedColor="gray.8"
  />
);
