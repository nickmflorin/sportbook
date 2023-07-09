import { type ReactNode } from "react";

import { ClerkProvider } from "@clerk/nextjs";

import { MantineProvider } from "./MantineProvider";
import { SWRConfig } from "./SWRConfig";

export interface AppConfigProps {
  readonly children: ReactNode;
}

export const AppConfig = ({ children }: AppConfigProps): JSX.Element => (
  <ClerkProvider>
    <MantineProvider>
      <SWRConfig>{children}</SWRConfig>
    </MantineProvider>
  </ClerkProvider>
);
