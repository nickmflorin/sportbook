import { icons } from "~/lib/ui";

import { ActionButton, type ActionButtonPolymorphicProps } from "./ActionButton";

export type DeleteButtonProps = Omit<ActionButtonPolymorphicProps<"bare">, "icon">;

export const DeleteButton = (props: DeleteButtonProps) => (
  <ActionButton.Bare
    {...props}
    icon={icons.IconNames.TRASH_CAN}
    color="red.7"
    hoveredColor="red.8"
    focusedColor="red.8"
  />
);
