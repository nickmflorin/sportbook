import { useState, useMemo } from "react";

import { Drawer, type DrawerProps } from "~/components/drawers/Drawer";

import { type DrawerRenderer } from "./types";

export interface DrawerRendererProps<P> {
  readonly onClose: () => void;
  readonly renderer?: DrawerRenderer<P>;
  readonly disabled?: boolean;
  readonly drawerProps?: Omit<DrawerProps, "loading" | "onClose" | "children" | "open">;
}

export const useDrawerRenderer = <P,>({ renderer, disabled, drawerProps, onClose }: DrawerRendererProps<P>) => {
  const [content, setContent] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState(false);

  const renderContent = useMemo(
    () =>
      async (...args: P[]) => {
        if (renderer && disabled !== true) {
          setLoading(true);
          const content = await renderer(...args);
          if (content) {
            setContent(content);
          } else {
            setContent(null);
          }
          setLoading(false);
        }
      },
    [renderer, disabled],
  );

  const drawer = (
    <Drawer
      {...drawerProps}
      loading={loading && content === null}
      open={loading || content !== null}
      onClose={() => onClose()}
    >
      {content}
    </Drawer>
  );

  return { drawer, renderContent, clearContent: () => setContent(null) };
};
