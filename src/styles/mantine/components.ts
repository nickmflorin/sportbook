import { type MantineTheme, TextStylesParams } from "@mantine/core";

export const components: MantineTheme["components"] = {
  Text: {
    styles: (theme, params: TextStylesParams, { size }) => ({
      root: {
        lineHeight:
          typeof size === "string" &&
          theme.other.textLineHeights[size] !== undefined
            ? theme.other.textLineHeights[size]
            : size,
      },
    }),
  },
};
