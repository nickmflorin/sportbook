import { type ReactNode } from "react";

export interface AppViewportProps {
  readonly children: ReactNode;
}

export const AppViewport = async ({ children }: AppViewportProps): Promise<JSX.Element> => (
  <div className="app-viewport">
    <div className="app-viewport__content">{children}</div>
    <div id="drawer-target" />
  </div>
);
