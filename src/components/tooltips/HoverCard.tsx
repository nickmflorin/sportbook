"use client";
import React, { type ReactNode } from "react";

import { HoverCard as RootHoverCard, type HoverCardProps as RootHoverCardProps } from "@mantine/core/lib/HoverCard";

export interface HoverCardProps extends Omit<RootHoverCardProps, "children"> {
  readonly popover?: JSX.Element | null | undefined;
  readonly disabled?: boolean;
  readonly children: ReactNode;
}

export const HoverCard = ({ children, popover, disabled = false, ...props }: HoverCardProps): JSX.Element => {
  if (popover === undefined || popover === null || disabled) {
    return <>{children}</>;
  }
  return (
    <RootHoverCard width="target" transitionProps={{ transition: "pop" }} {...props}>
      <RootHoverCard.Target>{children}</RootHoverCard.Target>
      <RootHoverCard.Dropdown className="popover">{popover}</RootHoverCard.Dropdown>
    </RootHoverCard>
  );
};
