import { Inter } from "next/font/google";

import { type MantineTheme, DEFAULT_THEME } from "@mantine/core";

import * as palettes from "./palettes";

export const InterFont = Inter({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

export const theme: MantineTheme = {
  ...DEFAULT_THEME,
  colors: {
    dark: DEFAULT_THEME.colors.dark,
    indigo: palettes.BLUE_PALETTE,
    blue: palettes.BLUE_PALETTE,
    primary: palettes.BLUE_PALETTE,
    success: palettes.GREEN_PALETTE,
    warning: palettes.YELLOW_PALETTE,
    error: palettes.RED_PALLETTE,
    red: palettes.RED_PALLETTE,
    yellow: palettes.YELLOW_PALETTE,
    green: palettes.GREEN_PALETTE,
    neutral: palettes.GRAY_PALETTE,
    gray: palettes.GRAY_PALETTE,
    orange: palettes.ORANGE_PALETTE,
    brown: palettes.BROWN_PALETTE,
    violet: palettes.VIOLET_PALETTE,
    lime: palettes.LIME_PALETTE,
    teal: palettes.TEAL_PALETTE,
    cyan: palettes.CYAN_PALETTE,
    grape: palettes.GRAPE_PALETTE,
    pink: palettes.PINK_PALETTE,
    heading: palettes.HEADING_PALETTE,
    body: palettes.BODY_PALETTE,
  },
  colorScheme: "light",
  defaultRadius: "xs",
  fontFamily: InterFont.style.fontFamily,
  fontSizes: {
    xxs: "10px",
    xs: "11px",
    // Corresponds to Caption in the Style Guide.
    sm: "12px",
    // Corresponds to Body Small in the Style Guide.
    md: "14px",
    // Corresponds to Body in the Style Guide.
    lg: "16px",
    // Corresponds to Sub Title in the Style Guide
    xl: "18px",
  },
  primaryColor: "primary",
  primaryShade: 5,
  radius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    // There are other radii in the style guide between 16px and 32px - for now we will ignore.
    lg: "16px",
    // There is a 40px in the style guide - for now we will cut off at 32px.
    xl: "32px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    xxl: "24px",
    xxxl: "32px",
  },
  black: "#000000",
  white: "#FFFFFF",
};
