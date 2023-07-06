"use client";
import { Flex, type FlexProps, Text } from "@mantine/core";

import { Actions, type Action, filterVisibleActions } from "./Actions";

export type ExposedHeaderProps = {
  readonly title?: string | JSX.Element;
  readonly subTitle?: string;
  readonly actions?: Action[];
};

export type HeaderProps = Omit<FlexProps, "direction" | "align" | "title" | "justify"> & ExposedHeaderProps;

export const Header = ({ title, subTitle, actions = [], ...props }: HeaderProps): JSX.Element =>
  subTitle || title || filterVisibleActions(actions).length !== 0 ? (
    <Flex {...props} direction="row" justify="space-between" align="center">
      {(subTitle || title) && (
        <Flex direction="column">
          {typeof title === "string" ? (
            <Text sx={t => ({ fontWeight: t.other.fontWeights.regular })} color="gray.8" fz="sm">
              {title}
            </Text>
          ) : (
            title
          )}
          {subTitle && (
            <Text sx={t => ({ fontWeight: t.other.fontWeights.regular })} color="gray.5" fz="xs">
              {subTitle}
            </Text>
          )}
        </Flex>
      )}
      <Actions h={20} actions={actions} />
    </Flex>
  ) : (
    <></>
  );
