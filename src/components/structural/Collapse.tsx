"use client";
import { type ReactNode } from "react";

import { Collapse as RootCollapse } from "@mantine/core";

export interface CollapseProps {
  readonly children: ReactNode;
  readonly opened?: boolean;
}

export const Collapse = ({ opened, children }: CollapseProps): JSX.Element =>
  opened !== undefined ? <RootCollapse in={opened}>{children}</RootCollapse> : <>{children}</>;
