import { type ReactNode } from "react";

import { ComponentProps, Spacing, Alignment, Orientation } from "~/lib/ui";
import { EnumeratedLiteralType, enumeratedLiterals } from "~/lib/util/literals";
import classNames from "classnames";

export interface FlexProps extends ComponentProps {
  readonly align?: Alignment;
  readonly orientation?: Orientation;
  readonly gap?: Spacing | null;
  readonly children: ReactNode;
}

export const Flex = ({
  align = "left",
  orientation = "horizontal",
  gap = "xs",
  children,
  ...props
}: FlexProps): JSX.Element => (
  <div
    {...props}
    className={classNames(
      "flex",
      `flex--orientation-${orientation}`,
      `flex--gap-${gap}`,
      `flex--align-${align}`,
      props.className,
    )}
  >
    {children}
  </div>
);
