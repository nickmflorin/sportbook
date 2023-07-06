"use client";
import { Flex, Text, type TextProps, type FlexProps, packSx } from "@mantine/core";

export interface DateTimeDisplayProps extends Omit<FlexProps, "h" | "mah" | "mih"> {
  readonly value: Date | null;
  readonly includeTime?: boolean;
  readonly size?: TextProps["size"];
  readonly dateColor?: TextProps["color"];
  readonly timeColor?: TextProps["color"];
  readonly dateTextProps?: Omit<TextProps, "size" | "color">;
  readonly timeTextProps?: Omit<TextProps, "size" | "color">;
}

export const DateTimeDisplay = ({
  value,
  timeTextProps,
  dateTextProps,
  dateColor = "gray.9",
  timeColor = "gray.6",
  size = "sm",
  direction = "column",
  gap = "xs",
  includeTime = true,
  align = "left",
  ...props
}: DateTimeDisplayProps): JSX.Element =>
  value ? (
    <Flex {...props} direction={direction} align={align} gap={direction === "column" ? 0 : gap}>
      <Text
        {...dateTextProps}
        color={dateColor}
        size={size}
        sx={[
          !includeTime ? { textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" } : undefined,
          ...packSx(dateTextProps?.sx),
        ]}
      >
        {`${value.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })}`}
      </Text>
      {includeTime && (
        <Text
          {...timeTextProps}
          size={size}
          color={timeColor}
          sx={[
            !includeTime ? { textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" } : undefined,
            ...packSx(timeTextProps?.sx),
          ]}
        >
          {value.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          })}
        </Text>
      )}
    </Flex>
  ) : (
    <></>
  );
