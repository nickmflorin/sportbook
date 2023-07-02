import { type ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "./MantineProvider";

export interface AppConfigProps {
  readonly children: ReactNode;
}

export const AppConfig = ({ children }: AppConfigProps): JSX.Element => (
  <MantineProvider>
    <ClerkProvider>{children}</ClerkProvider>
  </MantineProvider>
);
