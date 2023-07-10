import { type ReactNode } from "react";

import { SWRConfig as RootSWRConfig } from "swr";

type SWRConfigProps = { readonly children: ReactNode };

/**
 * Establishes global configuration for Vercel's {@link useSWR} hook in the context of this application that is
 * consistent with the requirements of Vercel's {@link useSWR} hook.
 *
 * See https://swr.vercel.app/
 */
export const SWRConfig = ({ children }: SWRConfigProps) => (
  <RootSWRConfig
    value={{
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      errorRetryCount: 0,
    }}
  >
    {children}
  </RootSWRConfig>
);
