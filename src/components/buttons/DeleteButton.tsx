import { ActionButton, type ActionButtonPolymorphicProps } from "./ActionButton";

export type DeleteButtonProps = Omit<ActionButtonPolymorphicProps<"bare">, "icon">;

export const DeleteButton = (props: DeleteButtonProps) => (
  <ActionButton.Bare {...props} icon={{ name: "trash-can" }} color="red.7" hoveredColor="red.8" focusedColor="red.8" />
);
