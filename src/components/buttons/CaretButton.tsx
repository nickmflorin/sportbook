import { icons } from "~/lib/ui";

import { ActionButton, type ActionButtonPolymorphicProps } from "./ActionButton";

export interface CaretButtonProps extends Omit<ActionButtonPolymorphicProps<"bare">, "icon"> {
  readonly open: boolean;
}

export const CaretButton = ({ open, ...props }: CaretButtonProps) => (
  <ActionButton.Bare
    {...props}
    icon={open ? icons.IconNames.CARET_DOWN : icons.IconNames.CARET_UP}
    color="gray.7"
    hoveredColor="gray.8"
    focusedColor="gray.8"
  />
);
