import { type ReactNode } from "react";

export interface AppViewportProps {
  readonly children: ReactNode;
}

export const AppViewport = async ({ children }: AppViewportProps): Promise<JSX.Element> => (
  <div className="app-viewport">
    <div className="app-viewport__content">{children}</div>
    {/* Renders drawer(s) whose open/closed state is determined from query parameters, not state.
    See ~/styles/globals/components/layout/drawers.scss for additional information. */}
    <div className="drawer-target" id="drawer-target" />
    {/* Renders a single drawer at a time whose open/closed behavior is managed in state, not by query parameters.
    See ~/styles/globals/components/layout/drawers.scss for additional information. */}
    <div className="drawer-target client-drawer-target" id="client-drawer-target" />
  </div>
);
