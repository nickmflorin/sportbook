import { type LinkProps } from "next/link";
import React from "react";

import classNames from "classnames";
import uniq from "lodash.uniq";

import { type ComponentProps } from "~/lib/ui";
import { type PathActive } from "~/lib/util/paths";
import { TabLink } from "~/components/buttons/TabLink";
import { type IconProp } from "~/components/icons";

export type TabItem = {
  readonly label: string;
  readonly icon?: IconProp;
  readonly href: LinkProps["href"];
  readonly queryParams?: string[];
  readonly active: PathActive;
  readonly visible?: boolean;
  readonly disabled?: boolean;
};

export interface TabsProps extends ComponentProps {
  readonly tabs: TabItem[];
  readonly queryParams?: string[];
}

export const Tabs = ({ tabs, queryParams = [], ...props }: TabsProps) => (
  <div className={classNames("tabs", props.className)}>
    {tabs.map((tab, i) => {
      if (tab.visible !== false) {
        const paramNames = uniq([...queryParams, ...(tab.queryParams ?? [])]);
        return <TabLink key={i} {...tab} paramNames={paramNames} />;
      } else {
        return <React.Fragment key={i} />;
      }
    })}
  </div>
);

export default Tabs;
