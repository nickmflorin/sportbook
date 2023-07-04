import { type ReactNode } from "react";

import classNames from "classnames";

import { ShowHide } from "../util";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export interface AppLayoutProps {
  readonly children: ReactNode;
  readonly authenticated: boolean;
}

export const AppLayout = async ({ children, authenticated }: AppLayoutProps): Promise<JSX.Element> => (
  <div className="app-layout">
    <Header />
    <main className={classNames("app-main", { "app-main--authenticated": authenticated })}>
      <ShowHide show={authenticated}>
        <Sidebar />
      </ShowHide>
      <div className="app-viewport">{children}</div>
    </main>
  </div>
);
