"use client";
import { useState, useEffect, type ReactNode } from "react";

import { createPortal } from "react-dom";

const createRootElement = (id: string | number): HTMLElement => {
  const rootContainer = document.createElement("div");
  rootContainer.setAttribute("id", String(id));
  return rootContainer;
};

export const usePortal = (id: string | number | undefined): Element | null => {
  const [parent, setParent] = useState<Element | null>(null);

  useEffect(() => {
    if (id !== undefined) {
      const existingParent = document.querySelector(`#${id}`);
      const parentElem = existingParent || createRootElement(id);
      setParent(parentElem);
    }
  }, [id]);

  return parent;
};

export interface PortalProps {
  id: string | number | undefined;
  children: ReactNode;
  open: boolean;
}

export const Portal = ({ id, children, open }: PortalProps): JSX.Element => {
  const target = usePortal(id);

  if (target !== null) {
    if (open) {
      /* See comments in src/styles/globals/components/layout/drawer.scss - this is related to the animation of the
         drawer transition.  We may not need this class name, which would mean we may be able to remove the 'open' prop
         from this component as well. */
      if (!target.classList.contains("open")) {
        target.classList.add("open");
      }
      return createPortal(children, target);
    } else {
      target.classList.remove("open");
    }
  }
  return <></>;
};
