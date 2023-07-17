import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps, type Spacing, type Style, type Alignment, type FlexDirection } from "~/lib/ui";

export interface FlexProps extends ComponentProps {
  readonly textAlign?: Alignment;
  readonly align?: Style["alignItems"];
  readonly justify?: Style["justifyContent"];
  readonly direction?: FlexDirection;
  readonly gap?: Spacing | null;
  readonly children: ReactNode;
}

export const Flex = ({
  textAlign,
  direction = "row",
  gap = "xs",
  children,
  justify,
  align,
  ...props
}: FlexProps): JSX.Element => (
  <div
    {...props}
    style={{
      ...props.style,
      justifyContent: justify || props.style?.justifyContent,
      alignItems: align || props.style?.alignItems,
    }}
    className={classNames(
      "flex",
      `flex--direction-${direction}`,
      `flex--gap-${gap}`,
      textAlign && `flex--text-align-${textAlign}`,
      props.className,
    )}
  >
    {children}
  </div>
);
