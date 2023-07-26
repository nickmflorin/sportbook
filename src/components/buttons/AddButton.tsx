import { ActionButton, type ActionButtonPolymorphicProps } from "./ActionButton";

export type AddButtonProps = Omit<ActionButtonPolymorphicProps<"bare">, "icon">;

export const AddButton = (props: AddButtonProps) => (
  <ActionButton.Bare
    {...props}
    icon={{ name: "circle-plus" }}
    color="green.7"
    hoveredColor="green.8"
    focusedColor="green.8"
  />
);
