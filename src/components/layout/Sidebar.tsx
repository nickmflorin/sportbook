import { type TablerIconsProps } from "@tabler/icons-react";

export type SidebarItem = {
  readonly icon: React.ComponentType<TablerIconsProps>;
};

export const Sidebar = (): JSX.Element => <div className="app-sidebar"></div>;
