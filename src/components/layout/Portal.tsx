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
}

export const Portal = ({ id, children }: PortalProps): JSX.Element => {
  const target = usePortal(id);
  if (target !== null) {
    return createPortal(children, target);
  }
  return <></>;
};
