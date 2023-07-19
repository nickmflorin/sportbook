import { type ReactNode } from "react";

import classNames from "classnames";

import { AppHeader } from "./AppHeader";
import { AppViewport } from "./AppViewport";
import { Sidebar, type SidebarProps } from "./Sidebar";

export type AuthenticatedAppLayoutProps = SidebarProps & {
  readonly children: ReactNode;
  readonly authenticated: true;
};

export type PublicAppLayoutProps = Partial<Record<keyof SidebarProps, never>> & {
  readonly children: ReactNode;
  readonly authenticated?: false;
};

export type AppLayoutProps = AuthenticatedAppLayoutProps | PublicAppLayoutProps;

export const AppLayout = async ({ sidebar, children, authenticated }: AppLayoutProps): Promise<JSX.Element> => (
  <div className="app-layout">
    <AppHeader />
    <main className={classNames("app-main", { "app-main--authenticated": authenticated })}>
      {authenticated === true && <Sidebar sidebar={sidebar} />}
      {authenticated ? <AppViewport>{children}</AppViewport> : children}
    </main>
  </div>
);
