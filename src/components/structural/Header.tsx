"use client";
import { Flex, type FlexProps, Text } from "@mantine/core";
import classNames from "classnames";
import { Actions, type Action, filterVisibleActions } from "./Actions";

export type ExposedHeaderProps = {
  readonly title?: string | JSX.Element;
  readonly subTitle?: string;
  readonly actions?: Action[];
};

export type HeaderProps = Omit<FlexProps, "direction" | "align" | "title" | "justify"> & ExposedHeaderProps;

export const Header = ({ title, subTitle, actions = [], ...props }: HeaderProps): JSX.Element =>
  subTitle || title || filterVisibleActions(actions).length !== 0 ? (
    <Flex
      {...props}
      className={classNames("header", props.className)}
      direction="row"
      justify="space-between"
      align="center"
    >
      {(subTitle || title) && (
        <Flex direction="column" className="header__titles">
          {typeof title === "string" ? <Text className="title">{title}</Text> : title}
          {subTitle && <Text className="subtitle">{subTitle}</Text>}
        </Flex>
      )}
      <Actions actions={actions} />
    </Flex>
  ) : (
    <></>
  );
