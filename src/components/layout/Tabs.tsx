import { type LinkProps } from "next/link";

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
};

export interface TabsProps extends ComponentProps {
  readonly tabs: TabItem[];
}

export const Tabs = ({ tabs, ...props }: TabsProps) => (
  <div className={classNames("tabs", props.className)}>
    {tabs.map((tab, i) => (
      <TabLink key={i} label={tab.label} icon={tab.icon} isActive={true} href={tab.href} />
    ))}
  </div>
);