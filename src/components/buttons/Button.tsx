import { Button as RootButton, type ButtonProps as RootButtonProps } from "@mantine/core";
import { type PolymorphicComponentProps } from "@mantine/utils";

export type ButtonProps = PolymorphicComponentProps<"button", RootButtonProps>;

export function Button(props: ButtonProps): JSX.Element {
  return <RootButton<"button"> {...props} />;
}
