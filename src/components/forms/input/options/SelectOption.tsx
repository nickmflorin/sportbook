import { forwardRef } from "react";

import { Flex, Checkbox } from "@mantine/core";

export type SelectOptionProps = React.ComponentPropsWithoutRef<"div"> & {
  readonly disabled?: boolean;
  readonly selected?: boolean;
  readonly withCheckbox?: boolean;
  readonly h?: number | string;
};

export const SelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(function SelectOption(
  { children, withCheckbox, selected, h = 32, ...others },
  ref,
) {
  return (
    <Flex
      direction="row"
      {...others}
      ref={ref}
      style={{ height: h }}
      align="center"
      bg="white"
      sx={t => ({
        color: t.colors.gray[9],
        "&[data-selected]": {
          backgroundColor: t.white,
          color: t.colors.gray[9],
        },
        "&[data-selected]:hover": {
          backgroundColor: t.colors.gray[0],
          color: t.colors.gray[9],
        },
        "&:hover": {
          backgroundColor: t.colors.gray[0],
          color: t.colors.gray[9],
        },
      })}
    >
      {withCheckbox && <Checkbox readOnly checked={selected} mr="md" size={14} />}
      {children}
    </Flex>
  );
});
