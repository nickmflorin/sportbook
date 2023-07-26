import { ActionButton, type ActionButtonPolymorphicProps } from "./ActionButton";

export type EllipsisButtonProps = Omit<
  ActionButtonPolymorphicProps<"bare">,
  "icon" | "color" | "hoveredColor" | "focusedColor"
>;

export const EllipsisButton = (props: EllipsisButtonProps) => (
  <ActionButton.Bare
    {...props}
    icon={{ name: "ellipsis" }}
    color="gray.6"
    hoveredColor="gray.7"
    focusedColor="gray.7"
  />
);
