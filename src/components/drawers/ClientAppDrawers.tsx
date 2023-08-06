"use client";
import { useContext, useState, useEffect } from "react";

import { DrawerContext } from "~/components/context/DrawerContext";

import { Drawer } from "./Drawer";
import { type DrawerId } from "./types";

interface ClientAppDrawersProps {
  readonly drawerContent: { [key in DrawerId]: (() => Promise<JSX.Element>) | null };
}

export const ClientAppDrawers = ({ drawerContent }: ClientAppDrawersProps): JSX.Element => {
  const drawerId = useContext(DrawerContext);
  const [element, setElement] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const render = async (id: DrawerId) => {
      const renderer = drawerContent[id];
      if (renderer) {
        const result = await renderer();
        setElement(<Drawer>{result}</Drawer>);
      }
    };

    if (drawerId) {
      render(drawerId);
    } else {
      setElement(null);
    }
  }, [drawerId, drawerContent]);

  return <>{element}</>;
};

export default ClientAppDrawers;
