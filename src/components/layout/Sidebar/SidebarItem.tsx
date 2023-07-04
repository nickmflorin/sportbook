"use client";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import { type TablerIconsProps } from "@tabler/icons-react";
import classNames from "classnames";

import { type PathActive, pathIsActive } from "~/lib/paths";

export type SidebarItemConfig = {
  readonly icon: React.ComponentType<TablerIconsProps>;
  readonly href: LinkProps["href"];
  readonly active: PathActive;
};

export const SidebarItem = ({ href, active, icon: Icon }: SidebarItemConfig): JSX.Element => {
  const pathname = usePathname();
  return (
    <Link className={classNames("sidebar-item", { active: pathIsActive(active, pathname) })} href={href}>
      <Icon size={24} />
    </Link>
  );
};
