import { type ReactNode } from "react";

import classNames from "classnames";

import {
  type ComponentProps,
  type Spacing,
  type Style,
  type Alignment,
  type FlexDirection,
  type MarginProps,
  type PaddingProps,
  getComponentNativeProps,
} from "~/lib/ui";

export interface FlexProps extends ComponentProps, MarginProps, PaddingProps {
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
  gap,
  children,
  justify,
  align,
  ...props
}: FlexProps): JSX.Element => (
  <div
    style={{
      ...props.style,
      justifyContent: justify || props.style?.justifyContent,
      alignItems: align || props.style?.alignItems,
    }}
    {...getComponentNativeProps(props, {
      className: classNames(
        "flex",
        `flex--direction-${direction}`,
        gap && `flex--gap-${gap}`,
        textAlign && `flex--text-align-${textAlign}`,
        props.className,
      ),
    })}
  >
    {children}
  </div>
);
