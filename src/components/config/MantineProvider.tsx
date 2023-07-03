"use client";

import { useServerInsertedHTML } from "next/navigation";

import { CacheProvider } from "@emotion/react";
import { useEmotionCache, MantineProvider as RootMantineProvider } from "@mantine/core";

import { theme } from "~/styles/mantine";

export const MantineProvider = ({ children }: { children: React.ReactNode }) => {
  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <RootMantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        {children}
      </RootMantineProvider>
    </CacheProvider>
  );
};
