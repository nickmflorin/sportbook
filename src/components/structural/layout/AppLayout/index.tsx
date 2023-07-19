import { type ReactNode } from "react";

import classNames from "classnames";

import { ShowHide } from "~/components/util";

import { AppHeader } from "./AppHeader";
import { AppViewport } from "./AppViewport";
import { Sidebar, type SidebarProps } from "./Sidebar";

export type AuthenticatedAppLayoutProps = SidebarProps & {
  readonly children: ReactNode;
  readonly authenticated: true;
};

export type PublicAppLayoutProps = Record<keyof SidebarProps, never> & {
  readonly children: ReactNode;
  readonly authenticated?: false;
};

export type AppLayoutProps = AuthenticatedAppLayoutProps | PublicAppLayoutProps;

export const AppLayout = async ({ sidebar, children, authenticated }: AppLayoutProps): Promise<JSX.Element> => (
  <div className="app-layout">
    <AppHeader />
    <main className={classNames("app-main", { "app-main--authenticated": authenticated })}>
      <ShowHide show={authenticated === true}>
        <Sidebar sidebar={sidebar} />
      </ShowHide>
      {authenticated ? <AppViewport>{children}</AppViewport> : children}
    </main>
  </div>
);
