import { useSearchParams } from "next/navigation";
import React, { type ReactNode, useMemo } from "react";

import { DrawerContext } from "~/components/context/DrawerContext";
import { DrawerIds } from "~/components/drawers";

export interface DrawerConfigProps {
  readonly children: ReactNode;
}

export const DrawerConfig = (props: DrawerConfigProps) => {
  const searchParams = useSearchParams();

  const drawerId = useMemo(() => {
    const id = searchParams.get("drawerId");
    if (id && DrawerIds.contains(id)) {
      return id;
    }
    return null;
  }, [searchParams]);

  return <DrawerContext.Provider value={drawerId}>{props.children}</DrawerContext.Provider>;
};
