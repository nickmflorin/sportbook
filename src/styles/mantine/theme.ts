import { Inter } from "next/font/google";

import { MantineTheme, DEFAULT_THEME } from "@mantine/core";

import { components } from "./components";
import * as palettes from "./palettes";

export const InterFont = Inter({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

export const theme: MantineTheme = {
  ...DEFAULT_THEME,
  components,
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
  headings: {
    fontFamily: InterFont.style.fontFamily,
    fontWeight: 500,
    sizes: {
      // Heading font weights are 400 | 500 | 600 | 700 - the value here is just the default for h1.
      h1: { fontSize: "48px", fontWeight: 400, lineHeight: "60px" },
      // Heading font weights are 400 | 500 | 600 | 700 - the value here is just the default for h1.
      h2: { fontSize: "34px", fontWeight: 400, lineHeight: "44px" },
      // Heading font weights are 400 | 500 | 600 | 700 - the value here is just the default for h1.
      h3: { fontSize: "24px", fontWeight: 400, lineHeight: "32px" },
      // Heading font weights are 400 | 500 | 600 | 700 - the value here is just the default for h1.
      h4: { fontSize: "20px", fontWeight: 400, lineHeight: "28px" },
      // Heading font weights are 400 | 500 | 600 | 700 - the value here is just the default for h5.
      h5: { fontSize: "18px", fontWeight: 400, lineHeight: "24px" },
      // Heading font weights are 400 | 500 | 600 | 700 - the value here is just the default for h6.
      h6: { fontSize: "16px", fontWeight: 400, lineHeight: "20px" },
    },
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
  shadows: {
    xs: "0px 1px 2px rgba(16, 24, 40, 0.05)",
    sm: "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px -2px rgba(16, 24, 40, 0.1)",
    md: "0px 4px 6px -1px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.1)",
    lg: "0px 10px 15px -3px rgba(16, 24, 40, 0.1), 0px 4px 6px -4px rgba(16, 24, 40, 0.1)",
    xl: "0px 20px 25px -5px rgba(16, 24, 40, 0.1), 0px 8px 10px -6px rgba(16, 24, 40, 0.1)",
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
  other: {
    fontWeights: {
      bold: 700,
      semibold: 600,
      medium: 500,
      regular: 400,
    },
    sizes: {
      xs: "32px",
      sm: "32px",
      md: "40px",
      lg: "48px",
      xl: "48px",
    },
    textLineHeights: {
      xxs: "12px",
      xs: "16px",
      sm: "18px",
      md: "22px",
      lg: "24px",
      xl: "28px",
    },
  },
};
