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
  /* Note: Right now, using the <ScreenLoading /> component does not show the loading indicator and an error surfaces
     letting us know that the icon cannot be found.  This is because we are trying to show the loading indicator before
     FontAwesome is loaded.  We might want to investigate a fallback loading indicator for these cases, one that doesn't
     require loading a large external library like FontAwesome when the application is loading. */
  return (
    <MantineProvider>
      <SWRConfig>{configured === true ? props.children : <ScreenLoading />}</SWRConfig>
    </MantineProvider>
  );
};
