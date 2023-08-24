import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { Flex } from "~/components/structural/Flex";

export interface PopoverContentProps extends ComponentProps {
  readonly children: ReactNode;
}

export const PopoverContent = ({ children, ...props }: PopoverContentProps): JSX.Element => (
  <Flex {...props} direction="column" p="sm" className={classNames("popover-content", props.className)}>
    {children}
  </Flex>
);
