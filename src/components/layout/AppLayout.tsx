import { type ReactNode } from "react";

import classNames from "classnames";

import { ShowHide } from "../util";

import { AppHeader } from "./AppHeader";
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
      {children}
    </main>
  </div>
);
