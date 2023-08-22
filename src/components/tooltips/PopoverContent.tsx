import { type ReactNode } from "react";

import { Flex } from "~/components/structural/Flex";

export interface PopoverContentProps {
  readonly children: ReactNode;
}

export const PopoverContent = ({ children }: PopoverContentProps): JSX.Element => (
  <Flex direction="column" p="sm">
    {children}
  </Flex>
);
