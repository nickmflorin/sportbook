import { ActionButton, type ActionButtonPolymorphicProps } from "./ActionButton";

export interface CaretButtonProps extends Omit<ActionButtonPolymorphicProps<"bare">, "icon"> {
  readonly open: boolean;
}

export const CaretButton = ({ open, ...props }: CaretButtonProps) => (
  <ActionButton.Bare
    {...props}
    icon={open ? { name: "caret-down" } : { name: "caret-up" }}
    color="gray.7"
    hoveredColor="gray.8"
    focusedColor="gray.8"
  />
);
