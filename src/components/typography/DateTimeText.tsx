import classNames from "classnames";

import { FlexDirections } from "~/lib/ui";
import { Flex, type FlexProps } from "~/components/structural";
import { Text, type TextProps } from "~/components/typography/Text";

import { TypographySizes } from "./types";

export interface DateTimeTextProps extends Omit<FlexProps, "children"> {
  readonly value: Date | null;
  readonly includeTime?: boolean;
  readonly size?: TextProps["size"];
  readonly dateColor?: TextProps["color"];
  readonly timeColor?: TextProps["color"];
  readonly dateSize?: TextProps["size"];
  readonly timeSize?: TextProps["size"];
}

export const DateTimeText = ({
  value,
  dateColor = "gray.9",
  timeColor = "gray.6",
  dateSize = TypographySizes.SM,
  timeSize = TypographySizes.SM,
  size,
  direction = FlexDirections.COLUMN,
  includeTime = true,

  ...props
}: DateTimeTextProps): JSX.Element =>
  value ? (
    <Flex {...props} direction={direction} className={classNames("date-time-text", props.className)}>
      <Text color={dateColor} size={dateSize === undefined ? size : dateSize} truncate={!includeTime}>
        {`${value.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })}`}
      </Text>
      {includeTime && (
        <Text size={timeSize === undefined ? timeSize : size} color={timeColor} truncate={true}>
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
