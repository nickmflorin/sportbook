"use client";
import React, { type ReactNode } from "react";

/* FontAwesome's stylesheet must be imported, before any internal components or stylesheets are imported. */
import "@fortawesome/fontawesome-svg-core/styles.css";

import { ScreenLoading } from "~/components/loading";

import { MantineProvider } from "./MantineProvider";
import { SWRConfig } from "./SWRConfig";
import { useAsyncClientConfiguration } from "./useAsyncClientConfiguration";

export interface ClientConfigProps {
  readonly children: ReactNode;
}

export const ClientConfig = (props: ClientConfigProps) => {
  const [configured] = useAsyncClientConfiguration();
  return (
    <MantineProvider>
      <SWRConfig>{configured === true ? props.children : <ScreenLoading />}</SWRConfig>
    </MantineProvider>
  );
};
