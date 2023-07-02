import { Tuple, DefaultMantineColor, MantineSize } from "@mantine/core";

type ExtendedCustomColors =
  | "heading"
  | "body"
  | "success"
  | "error"
  | "warning"
  | "brown"
  | "primary"
  | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }

  export type FontWeight = 400 | 500 | 600 | 700;
  export type FontWeightName = "bold" | "semibold" | "medium" | "regular";

  export interface MantineThemeOther {
    fontWeights: { [key in FontWeightName]: FontWeight };
    textLineHeights: { [key in MantineSize]: string };
    sizes: { [key in MantineSize]: string };
    textLineHeights: { [key in MantineSize]: string };
  }
}
