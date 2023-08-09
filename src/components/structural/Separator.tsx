import { type ComponentProps, type MarginProps, getComponentNativeProps } from "~/lib/ui";

export interface SeparatorProps extends ComponentProps, Pick<MarginProps, "m" | "mt" | "mb"> {}

export const Separator = (props: SeparatorProps): JSX.Element => (
  <div {...getComponentNativeProps(props, { className: "separator" })} />
);
