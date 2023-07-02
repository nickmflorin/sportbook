import { TablerIconsProps } from "@tabler/icons-react";

export type SidebarItem = {
  readonly icon: React.ComponentType<TablerIconsProps>;
};

export interface SidebarProps {}

export const Sidebar = (props: SidebarProps): JSX.Element => <div className="app-sidebar"></div>;
