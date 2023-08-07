"use client";
import { useSearchParams } from "next/navigation";
import { useContext, useState, useEffect, useMemo } from "react";

import { DrawerContext } from "~/components/context/DrawerContext";

import { Drawer } from "./Drawer";
import { type DrawerId } from "./types";

type ClientAppDrawer<P extends string> = {
  readonly render: (params: [string, string][]) => Promise<JSX.Element | null>;
  readonly params: P[];
};

interface ClientAppDrawersProps<D extends { [key in DrawerId]: ClientAppDrawer<string> | null }> {
  readonly drawers: D;
}

export const ClientAppDrawers = <D extends { [key in DrawerId]: ClientAppDrawer<string> | null }>({
  drawers,
}: ClientAppDrawersProps<D>): JSX.Element => {
  const searchParams = useSearchParams();
  const drawerId = useContext(DrawerContext);
  const [element, setElement] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState(false);

  const drawer = useMemo(() => {
    if (drawerId) {
      return drawers[drawerId];
    }
    return null;
  }, [drawerId, drawers]);

  useEffect(() => {
    const render = async (d: ClientAppDrawer<string>) => {
      setLoading(true);
      const result = await d.render([...searchParams.entries()]);
      if (result) {
        setElement(result);
      }
      setLoading(false);
    };
    if (drawer) {
      render(drawer);
    } else {
      setElement(null);
    }
  }, [drawer, searchParams]);

  if (drawer) {
    return <Drawer loading={loading}>{element}</Drawer>;
  }
  return <></>;
};

export default ClientAppDrawers;
