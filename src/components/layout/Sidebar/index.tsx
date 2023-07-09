"use client";
import { IconJumpRope, IconBrandAsana, IconChessQueen } from "@tabler/icons-react";

import { createLeadingPathRegex } from "~/lib/util/paths";

import { SidebarItem, type SidebarItemConfig } from "./SidebarItem";

const SidebarItems: SidebarItemConfig[] = [
  { href: "/dashboard", icon: IconJumpRope, active: createLeadingPathRegex("/dashboard") },
  { href: "/leagues", icon: IconJumpRope, active: createLeadingPathRegex("/leagues") },
  { href: "/teams", icon: IconBrandAsana, active: createLeadingPathRegex("/teams") },
  { href: "/games", icon: IconChessQueen, active: createLeadingPathRegex("/games") },
];

export const Sidebar = (): JSX.Element => (
  <div className="app-sidebar">
    {SidebarItems.map((item, i) => (
      <SidebarItem key={i} {...item} />
    ))}
  </div>
);
