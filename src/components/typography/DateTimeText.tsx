import classNames from "classnames";

import { Flex, type FlexProps } from "~/components/structural/Flex";
import { Text, type TextProps } from "~/components/typography";

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
  dateSize = "sm",
  timeSize = "sm",
  size,
  orientation = "vertical",
  includeTime = true,
  ...props
}: DateTimeTextProps): JSX.Element =>
  value ? (
    <Flex {...props} orientation={orientation} className={classNames("date-time-Text", props.className)}>
      <Text color={dateColor} size={size === undefined ? dateSize : size} truncate={!includeTime}>
        {`${value.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })}`}
      </Text>
      {includeTime && (
        <Text size={size} color={timeColor} truncate={true}>
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
