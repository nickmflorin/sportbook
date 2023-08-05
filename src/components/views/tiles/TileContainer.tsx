import React from "react";

import classNames from "classnames";

import { Flex, type FlexProps } from "~/components/structural/Flex";

export type TileContainerProps = FlexProps;

export const TileContainer = ({ children, ...props }: TileContainerProps): JSX.Element => (
  <Flex direction="column" {...props} className={classNames("tile", props.className)}>
    {children}
  </Flex>
);
