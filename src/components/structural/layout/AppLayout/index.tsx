import { type ReactNode } from "react";

import classNames from "classnames";

import { ShowHide } from "~/components/util";

import { AppHeader } from "./AppHeader";
import { AppViewport } from "./AppViewport";
import { Sidebar } from "./Sidebar";

export interface AppLayoutProps {
  readonly children: ReactNode;
  readonly authenticated: boolean;
}

export const AppLayout = async ({ children, authenticated }: AppLayoutProps): Promise<JSX.Element> => (
  <div className="app-layout">
    <AppHeader />
    <main className={classNames("app-main", { "app-main--authenticated": authenticated })}>
      <ShowHide show={authenticated}>
        <Sidebar />
      </ShowHide>
      {authenticated ? <AppViewport>{children}</AppViewport> : children}
    </main>
  </div>
);
