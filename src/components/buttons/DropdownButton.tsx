import { type Style } from "~/lib/ui";

import { SolidButton } from "./SolidButton";

export interface DropdownButtonProps {
  readonly children?: string | JSX.Element;
  readonly open: boolean;
  readonly style?: Omit<Style, "width">;
  readonly width?: number | string;
  readonly onClick: () => void;
}

export const DropdownButton = ({ children, open, style, width, ...props }: DropdownButtonProps) => {
  console.log({ open });
  return (
    <SolidButton.Outline
      {...props}
      style={{ textAlign: "left", ...style, width }}
      icon={open ? { name: "chevron-up" } : { name: "chevron-down" }}
      iconSize="xs"
      iconLocation="right"
      condensed
    >
      {children}
    </SolidButton.Outline>
  );
};
