import { ActionButton, type ActionButtonPolymorphicProps } from "./ActionButton";

export type EditTableRowButtonProps = Omit<
  ActionButtonPolymorphicProps<"bare">,
  "icon" | "color" | "hoveredColor" | "focusedColor"
>;

export const EditTableRowButton = (props: EditTableRowButtonProps) => (
  <ActionButton.Bare
    {...props}
    icon={{ name: "pen-to-square" }}
    color="blue.12"
    hoveredColor="blue.14"
    focusedColor="blue.14"
  />
);
