"use client";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import classNames from "classnames";
import { Icon } from "~/components/display/icons";
import { icons } from "~/lib/ui";
import { type PathActive, pathIsActive } from "~/lib/util/paths";

export type SidebarItemConfig = {
  readonly icon: icons.IconProp;
  readonly href: LinkProps["href"];
  readonly active: PathActive;
};

export const SidebarItem = ({ href, active, icon }: SidebarItemConfig): JSX.Element => {
  const pathname = usePathname();
  return (
    <Link className={classNames("sidebar-item", { active: pathIsActive(active, pathname) })} href={href}>
      <Icon icon={icon} />
    </Link>
  );
};
