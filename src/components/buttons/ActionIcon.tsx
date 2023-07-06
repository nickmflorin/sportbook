"use client";
import {
  ActionIcon as RootActionIcon,
  type ActionIconProps as RootActionIconProps,
  packSx,
  type MantineTheme,
} from "@mantine/core";
import { type PolymorphicComponentProps } from "@mantine/utils";
import { type TablerIconsProps } from "@tabler/icons-react";

export enum ActionIconColor {
  BLUE,
  GRAY,
}

export type ActionIconProps<C = "button"> = Omit<
  PolymorphicComponentProps<C, RootActionIconProps>,
  "children" | "color"
> & {
  readonly icon: React.ComponentType<TablerIconsProps>;
  readonly color?: ActionIconColor;
  readonly stroke?: number;
};

type ColorSet = {
  readonly color: (t: MantineTheme) => string;
  readonly hoverColor?: (t: MantineTheme) => string;
  readonly loaderColor?: (t: MantineTheme) => string;
};

const ColorSets: { [key in ActionIconColor]: ColorSet } = {
  [ActionIconColor.BLUE]: {
    color: t => t.colors.blue[6],
    hoverColor: t => t.colors.blue[5],
    loaderColor: t => t.colors.blue[6],
  },
  [ActionIconColor.GRAY]: {
    color: t => t.colors.gray[6],
    hoverColor: t => t.colors.gray[5],
    loaderColor: t => t.colors.gray[6],
  },
};

const digestColorSet = ({ sx, loaderProps, color = ActionIconColor.GRAY }: Omit<ActionIconProps, "icon">) => ({
  loaderProps: { size: "xs", color: "gray.7", ...loaderProps },
  sx: [
    (t: MantineTheme) => ({
      /* We use the SVG selector to set the color such that the hover color takes affect when the ActionIcon is hovered.
         If we do not use the > svg selector, and set the color on the Icon directly, the Icon will not change color
         when the ActionIcon is hovered. */
      "> svg": {
        color: ColorSets[color].color(t),
      },
      loader: { backgroundColor: "transparent" },
      ...t.fn.hover({ "> svg": ColorSets[color].hoverColor?.(t) || ColorSets[color].color(t) }),
    }),
    ...packSx(sx),
  ],
});

export const ActionIcon = ({
  icon: Icon,
  stroke = 1.8,
  variant = "transparent",
  size = 16,
  color = ActionIconColor.GRAY,
  ...props
}: ActionIconProps) => {
  return (
    <RootActionIcon {...props} size={size} variant={variant} {...digestColorSet({ color, ...props })}>
      <Icon stroke={stroke} />
    </RootActionIcon>
  );
};
