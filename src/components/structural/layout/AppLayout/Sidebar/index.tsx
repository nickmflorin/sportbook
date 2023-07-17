"use client";
import { icons } from "~/lib/ui";
import { createLeadingPathRegex } from "~/lib/util/paths";

import { SidebarItem, type SidebarItemConfig } from "./SidebarItem";

const SidebarItems: SidebarItemConfig[] = [
  { href: "/dashboard", icon: icons.IconNames.HOUSE_CHIMNEY, active: createLeadingPathRegex("/dashboard") },
  { href: "/leagues", icon: icons.IconNames.SITEMAP, active: createLeadingPathRegex("/leagues") },
  { href: "/teams", icon: icons.IconNames.PEOPLE_GROUP, active: createLeadingPathRegex("/teams") },
  { href: "/games", icon: icons.IconNames.TABLE_TENNIS_PADDLE_BALL, active: createLeadingPathRegex("/games") },
];

export const Sidebar = (): JSX.Element => (
  <div className="app-sidebar">
    {SidebarItems.map((item, i) => (
      <SidebarItem key={i} {...item} />
    ))}
  </div>
);
