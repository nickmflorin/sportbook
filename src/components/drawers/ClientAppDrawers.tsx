"use client";
import { useSearchParams } from "next/navigation";
import { useContext, useState, useEffect } from "react";

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

  useEffect(() => {
    const render = async (id: DrawerId) => {
      const dw = drawers[id];
      if (dw) {
        const result = await dw.render([...searchParams.entries()]);
        if (result) {
          return setElement(<Drawer>{result}</Drawer>);
        }
      }
      return setElement(null);
    };
    if (drawerId) {
      render(drawerId);
    } else {
      setElement(null);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [drawerId, drawers]);

  return <>{element}</>;
};

export default ClientAppDrawers;
