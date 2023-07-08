import { type ReactNode } from "react";

import { AppViewport } from "~/components/layout";

export default function LeaguesLayout({ children, drawer }: { children: React.ReactNode; drawer: ReactNode }) {
  return <AppViewport>{children}</AppViewport>;
}
