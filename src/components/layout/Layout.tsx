import { type ReactNode } from "react";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ShowHide } from "../util";

export interface AppLayoutProps {
  readonly children: ReactNode;
  readonly authenticated: boolean;
}

export const AppLayout = async ({ children, authenticated }: AppLayoutProps): Promise<JSX.Element> => (
  <div className="app-layout">
    <Header />
    <main>
      <ShowHide show={authenticated}>
        <Sidebar />
      </ShowHide>
      {children}
    </main>
  </div>
);
