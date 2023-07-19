import { SidebarItem, type SidebarItemConfig } from "./SidebarItem";

export interface SidebarProps {
  readonly sidebar: SidebarItemConfig[];
}

export const Sidebar = ({ sidebar }: SidebarProps): JSX.Element => (
  <div className="app-sidebar">
    {sidebar.map((item, i) => (
      <SidebarItem key={i} {...item} />
    ))}
  </div>
);
