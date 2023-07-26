import dynamic from "next/dynamic";
import Script from "next/script";
import { type ReactNode } from "react";

import { ClerkProvider } from "@clerk/nextjs";

import { env } from "~/env.mjs";

const ClientConfig = dynamic(() => import("./ClientConfig"), { ssr: false });

export interface AppConfigProps {
  readonly children: ReactNode;
}

export const AppConfig = ({ children }: AppConfigProps): JSX.Element => (
  <>
    <Script
      type="text/javascript"
      src={`https://kit.fontawesome.com/${env.FONT_AWESOME_KIT_TOKEN}.js`}
      crossOrigin="anonymous"
      data-auto-replace-svg="nest"
      async
    />
    <ClerkProvider>
      <ClientConfig>{children}</ClientConfig>
    </ClerkProvider>
  </>
);
