"use client";
import { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { type PathActive, pathIsActive } from "~/lib/util/paths";
import { TabLink } from "~/components/buttons/TabLink";
import { type IconProp } from "~/components/icons";

export type TabItem = {
  readonly label: string;
  readonly icon?: IconProp;
  readonly href: LinkProps["href"];
  readonly active: PathActive;
  readonly visible?: boolean;
  readonly disabled?: boolean;
};

export interface TabsProps extends ComponentProps {
  readonly tabs: TabItem[];
}

export const Tabs = ({ tabs, ...props }: TabsProps) => {
  const pathname = usePathname();
  return (
    <div className={classNames("tabs", props.className)}>
      {tabs.map(({ active, ...tab }, i) =>
        tab.visible !== false ? (
          <TabLink key={i} {...tab} isActive={pathIsActive(active, pathname)} />
        ) : (
          <React.Fragment key={i} />
        ),
      )}
    </div>
  );
};
