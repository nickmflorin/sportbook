import React from "react";

import { Text, Flex, type FlexProps, useMantineTheme, type MantineTheme, packSx } from "@mantine/core";
import {
  IconExclamationCircle,
  IconAlertTriangle,
  type TablerIconsProps,
  IconCircleCheck,
  IconNote,
} from "@tabler/icons-react";

export enum FeedbackLevel {
  WARNING = "WARNING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  INFO = "INFO",
}

type FeedbackLevelDataDef = {
  readonly backgroundColor: string;
  readonly borderColor: string;
  readonly textColor: string;
  readonly iconColor?: string;
  readonly icon: React.ComponentType<TablerIconsProps>;
};

const FeedbackLevelData: { [key in FeedbackLevel]: (t: MantineTheme) => FeedbackLevelDataDef } = {
  [FeedbackLevel.ERROR]: t => ({
    iconColor: t.colors.red[4],
    textColor: t.colors.gray[7],
    backgroundColor: t.colors.red[0],
    borderColor: t.colors.red[5],
    icon: IconExclamationCircle,
  }),
  [FeedbackLevel.INFO]: t => ({
    iconColor: t.colors.gray[5],
    textColor: "dimmed",
    backgroundColor: "transparent",
    borderColor: "dimmed",
    icon: IconNote,
  }),
  [FeedbackLevel.WARNING]: t => ({
    iconColor: t.colors.red[4],
    textColor: t.colors.gray[7],
    backgroundColor: t.colors.yellow[0],
    borderColor: t.colors.yellow[5],
    icon: IconAlertTriangle,
  }),
  [FeedbackLevel.SUCCESS]: t => ({
    iconColor: t.colors.green[4],
    textColor: t.colors.gray[7],
    backgroundColor: t.colors.green[0],
    borderColor: t.colors.green[5],
    icon: IconCircleCheck,
  }),
};

type FeedbackUiProps = Omit<FlexProps, "align" | "direction" | "p">;

interface _LocalFeedbackProps extends FeedbackUiProps {
  readonly message: string | JSX.Element;
  readonly level?: FeedbackLevel;
  readonly subtle?: true;
  readonly orientation?: "vertical" | "horizontal";
  readonly icon?: React.ComponentType<TablerIconsProps>;
}

const ToOverlay = ({ children, overlay }: { children: JSX.Element; overlay?: boolean }): JSX.Element => {
  if (overlay) {
    return (
      <Flex
        h="100%"
        w="100%"
        direction="column"
        justify="center"
        align="center"
        pos="absolute"
        sx={{ zIndex: 1000, backgroundColor: "rgba(255, 255, 255, 0.75)" }}
      >
        {children}
      </Flex>
    );
  }
  return children;
};

const _LocalFeedback = ({
  orientation = "horizontal",
  level = FeedbackLevel.ERROR,
  message,
  icon,
  subtle,
  ...props
}: _LocalFeedbackProps): JSX.Element => {
  const theme = useMantineTheme();
  const { icon: DefaultIcon, iconColor, textColor, borderColor, backgroundColor } = FeedbackLevelData[level](theme);
  const Icon = icon || DefaultIcon;

  return (
    <Flex
      w="100%"
      {...props}
      align="center"
      direction={orientation === "vertical" ? "column" : "row"}
      justify={orientation === "vertical" ? "center" : "left"}
      p="sm"
      sx={[
        t => ({
          border: subtle === true ? "1px solid transparent" : `1px solid ${borderColor}`,
          backgroundColor: subtle === true ? "transparent" : backgroundColor,
          borderRadius: t.radius.xs,
        }),
        ...packSx(props.sx),
      ]}
    >
      <Icon size={16} color={iconColor || textColor} />
      <Flex
        mt={orientation === "vertical" ? "md" : undefined}
        direction={orientation === "vertical" ? "column" : "row"}
        justify={orientation === "vertical" ? "center" : "left"}
      >
        {typeof message === "string" ? (
          <Text
            size="sm"
            ml={orientation === "horizontal" ? "md" : undefined}
            color={textColor}
            align={orientation === "vertical" ? "center" : "left"}
          >
            {message}
          </Text>
        ) : (
          message
        )}
      </Flex>
    </Flex>
  );
};

export type LocalFeedbackData = {
  readonly level?: FeedbackLevel;
  readonly message: JSX.Element | string;
  readonly visible?: boolean;
  readonly icon?: React.ComponentType<TablerIconsProps>;
};

export type Feedback = LocalFeedbackData | null | undefined | (LocalFeedbackData | null | undefined)[];

type ExplicitFeedbackProps = FeedbackUiProps &
  Omit<LocalFeedbackData, "message"> & {
    readonly orientation?: "vertical" | "horizontal";
    readonly subtle?: true;
    readonly children: string | JSX.Element;
    readonly overlay?: boolean;
  };

type MultipleFeedbackProps = FeedbackUiProps & {
  readonly feedback: Feedback;
  readonly orientation?: "vertical" | "horizontal";
  readonly subtle?: true;
  readonly overlay?: boolean;
};

export type LocalFeedbackProps = ExplicitFeedbackProps | MultipleFeedbackProps;

const isMultipleFeedbackProps = (props: LocalFeedbackProps): props is MultipleFeedbackProps =>
  (props as ExplicitFeedbackProps).children === undefined;

/**
 * A component that should be used for rendering feedback alerts local to another component.  The component can render
 * one or many various feedback elements, where each feedback element is rendered based on the attributes defined in the
 * {@link LocalFeedbackData} interface.
 *
 * The component will appropriately ignore nullish values for feedback elements, or feedback elements that are
 * explicitly set to not be visible, while maintaining proper spacing between the elements themselves and as a whole
 * inside of the parent component.  When no valid, visible feedback elements are present, the component will not affect
 * the DOM (returning an empty fragment).
 *
 * @param {LocalFeedbackProps} props
 *   Props for the component that can either be provided as a single feedback element, {@link LocalFeedbackData}, or
 *   several feedback elements, provided as an array of {@link LocalFeedbackData} elements.
 *
 * @returns {JSX.Element}
 *
 * @example
 * // Rendering a single error alert.
 * <LocalFeedback visible level={FeedbackLevel.ERROR} message="There was an error." />
 *
 * @example
 * // Rendering a single warning alert.
 * <LocalFeedback level={FeedbackLevel.WARNING} message="This value may cause problems." />
 *
 * @example
 * // Rendering a series of feedback alerts.
 * <LocalFeedback feedback={[
 *   { level: FeedbackLevel.ERROR, message: "There was an error." },
 *   null, // Will be ignored.
 *   { level: FeedbackLevel.WARNING, message: "This value may cause problems."},
 *   // Will be ignored if isError is false.
 *   { level: FeedbackLevel.ERROR, message: "This was an API error.", visible: isError }
 * ]} />
 */
export const LocalFeedback = (props: LocalFeedbackProps): JSX.Element => {
  let flexProps: FeedbackUiProps;
  let feedback: LocalFeedbackData | null | undefined | (LocalFeedbackData | null | undefined)[];
  let visible: boolean | undefined;
  let level: FeedbackLevel | undefined;
  let message: JSX.Element | string | undefined;
  let icon: React.ComponentType<TablerIconsProps> | undefined;
  let subtle: true | undefined;
  let orientation: "vertical" | "horizontal" | undefined;
  let overlay: boolean | undefined;

  let feedbackData: (LocalFeedbackData | null | undefined)[] = [];
  if (isMultipleFeedbackProps(props)) {
    ({ feedback, orientation, subtle, overlay, ...flexProps } = props);
    feedbackData = Array.isArray(feedback) ? feedback : [feedback];
  } else {
    ({ visible, icon, children: message, level, subtle, orientation, overlay, ...flexProps } = props);
    feedbackData = [{ visible, message, level, icon }];
  }

  const visibleFeedback: LocalFeedbackData[] = feedbackData.filter(
    (f: LocalFeedbackData | null | undefined) => f !== null && f !== undefined && f.visible !== false,
  ) as LocalFeedbackData[];

  if (visibleFeedback.length === 1 && visibleFeedback[0] !== undefined) {
    return (
      <ToOverlay overlay={overlay}>
        <_LocalFeedback
          {...flexProps}
          subtle={subtle}
          orientation={orientation}
          level={visibleFeedback[0].level}
          message={visibleFeedback[0].message}
          icon={visibleFeedback[0].icon}
        />
      </ToOverlay>
    );
  } else if (visibleFeedback.length !== 0) {
    return (
      <ToOverlay overlay={overlay}>
        <Flex {...flexProps} w="100%" direction="column" gap="md">
          {visibleFeedback.map(({ level, message, icon }, i) => (
            <_LocalFeedback
              key={i}
              level={level}
              message={message}
              icon={icon}
              subtle={subtle}
              orientation={orientation}
            />
          ))}
        </Flex>
      </ToOverlay>
    );
  }
  return <></>;
};
