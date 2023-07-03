import { type ReactNode } from "react";

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
    <main className="app-main">
      <ShowHide show={authenticated}>
        <Sidebar />
      </ShowHide>
      <div className="app-viewport">{children}</div>
    </main>
  </div>
);
