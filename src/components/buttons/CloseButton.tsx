import { ActionButton, type ActionButtonPolymorphicProps } from "./ActionButton";

export type CloseButtonProps = Omit<ActionButtonPolymorphicProps<"bare">, "icon">;

export const CloseButton = (props: CloseButtonProps) => (
  <ActionButton.Bare {...props} icon={{ name: "xmark" }} color="gray.7" hoveredColor="gray.8" focusedColor="gray.8" />
);
