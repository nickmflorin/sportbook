import { type Style } from "~/lib/ui";

import { SolidButton, type SolidButtonPolymorphicProps } from "./SolidButton";

export interface DropdownButtonProps extends Omit<SolidButtonPolymorphicProps<"outline">, "children" | "style"> {
  readonly children?: string | JSX.Element;
  readonly open: boolean;
  readonly style?: Omit<Style, "width">;
  readonly width?: number | string;
}

export const DropdownButton = ({ children, open, style, width, ...props }: DropdownButtonProps) => (
  <SolidButton.Outline
    {...props}
    style={{ textAlign: "left", ...style, width }}
    iconSize="xs"
    iconLocation="right"
    condensed
    icon={[
      { icon: { name: "chevron-down" }, visible: !open },
      { icon: { name: "chevron-up" }, visible: open },
    ]}
  >
    {children}
  </SolidButton.Outline>
);
