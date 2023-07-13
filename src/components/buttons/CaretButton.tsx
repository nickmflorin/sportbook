import { icons } from "~/lib/ui";

import { BareActionButton, type BareActionButtonProps } from "./BareActionButton";

export interface CaretButtonProps extends Omit<BareActionButtonProps, "icon"> {
  readonly open: boolean;
}

export const CaretButton = ({ open, ...props }: CaretButtonProps) => (
  <BareActionButton {...props} icon={open ? icons.IconNames.CARET_DOWN : icons.IconNames.CARET_UP} color="gray.7" />
);
