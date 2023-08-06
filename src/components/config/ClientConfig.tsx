"use client";
import React, { type ReactNode } from "react";
/* FontAwesome's stylesheet must be imported, before any internal components or stylesheets are imported. */
// import "@fortawesome/fontawesome-svg-core/styles.css";

import { DrawerConfig } from "./DrawerConfig";
import { MantineProvider } from "./MantineProvider";
import { SWRConfig } from "./SWRConfig";

export interface ClientConfigProps {
  readonly children: ReactNode;
}

export const ClientConfig = (props: ClientConfigProps) => (
  <MantineProvider>
    <SWRConfig>
      <DrawerConfig>{props.children}</DrawerConfig>
    </SWRConfig>
  </MantineProvider>
);

export default ClientConfig;
