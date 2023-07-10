import { type ReactNode } from "react";

import { ClerkProvider } from "@clerk/nextjs";

import { ClientConfig } from "./ClientConfig";

export interface AppConfigProps {
  readonly children: ReactNode;
}

export const AppConfig = ({ children }: AppConfigProps): JSX.Element => (
  <ClerkProvider>
    <ClientConfig>{children}</ClientConfig>
  </ClerkProvider>
);
