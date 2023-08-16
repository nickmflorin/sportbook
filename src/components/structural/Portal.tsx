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

const usePortalTarget = (initialId?: string | number): [Element | null, (id: string | number) => void] => {
  const [id, setId] = useState<string | number | undefined>(initialId);
  const [parent, setParent] = useState<Element | null>(null);

  useEffect(() => {
    if (id !== undefined) {
      const existingParent = document.querySelector(`#${id}`);
      const parentElem = existingParent || createRootElement(id);
      setParent(parentElem);
    }
  }, [id]);

  return [parent, setId];
};

export interface PortalProps {
  readonly targetId: string | number | undefined;
  readonly fallbackTargetId?: string | number | undefined;
  readonly children: ReactNode;
  readonly open: boolean;
  /**
   * A callback function that indicates whether or not a potentially previously rendered child of the portal target
   * element is stale content that should be removed in favor of new content.  This can be used to swap drawers that
   * depend on dynamic parameters, such as an ID, without having to manage the state of the drawer content further up
   * in the tree.
   */
  readonly isExistingChild?: (element: Element) => boolean;
}

export const Portal = ({ targetId, children, fallbackTargetId, isExistingChild, open }: PortalProps): JSX.Element => {
  const [target, setId] = usePortalTarget();
  const [element, setElement] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (open && targetId) {
      setId(targetId);
    }
  }, [targetId, open, setId]);

  useEffect(() => {
    if (open && fallbackTargetId && target && target.children.length !== 0) {
      setId(fallbackTargetId);
    }
  }, [open, target, fallbackTargetId, setId]);

  useEffect(() => {
    if (target !== null) {
      console.log({ open, isExistingChild, numChildren: target.children.length });
      if (open) {
        /* If a child identifier is provided, and the target has more than one child where any of them meet that
           criteria, it means that the portal's content has changed and the new content is added as a sibling of the
           stale content.  In this case, all previously rendered content that meet that criteria (which should only be
           at most 1 element - but the loop accounts for potentially multiple due to unforeseen weird rendering
           behavior) should be removed.

           This allows content to be rendered in the portal that replaces older content, without having to alter the
           inner content of the portal itself when it changes.

           Example:
           --------
           There is a drawer that renders data associated with a Team with a particular ID when an associated row is
           clicked in a table.  When a new row is clicked, the team ID changes, and thus the content of the drawer
           changes as well.  If we were to leave stale children inside the portal, this situation would require that the
           outer <Drawer> be static, and the content inside of the drawer changes when the row is clicked. This would
           mean that the drawer would have to be rendered and managed at the table level, since it would have to
           rerender the content based on the ID:

           const [id, setId] = useState<string | null>(null);

           <Table>
             {teams.map((team) => ( <Row onClick={() => setId(team.id)} /> ))}
           </Table>
           <Drawer open={id !== null} onClose={() => setId(null)}>
              <DrawerContent id={id} />
           </Drawer>

           However, if we remove the stale children from the portal, we can render the drawer at the row level, and
           we don't have to worry about just changing the inner content of the <Drawer> component - the <Drawer> can
           be swapped in and out:

           <Table>
             {teams.map((team) => ( <Row /> ))}
           </Table>

           const [drawerOpen, setDrawerOpen] = useState(false);

           <Row onClick={() => openDrawer()} />
           <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <DrawerContent id={props.id} />
           </Drawer>
           */
        if (target.children.length !== 0) {
        }
        if (isExistingChild && target.children.length > 1) {
          let toRemove: Element[] = [];
          for (let i = 0; i < target.children.length - 1; i++) {
            const c = target.children[i];
            if (c && isExistingChild(c)) {
              toRemove = [...toRemove, c];
            }
          }
          setTimeout(() =>
            toRemove.forEach(c => {
              console.log({ removing: c });
              try {
                target.removeChild(c);
              } catch (e) {
                /* This sometimes fails when the component unmounts during a route change.  It would be nice to
                   eventually just throw the error we are looking for - but I cannot seem to figure out where to import
                   the NotFoundError from. */
              }
            }),
          );
        }
        const el = createPortal(children, target);
        setElement(el);
      } else {
        setElement(null);
      }
    } else {
      setElement(null);
    }
  }, [open, target, children, isExistingChild]);

  return <>{element}</>;
};
