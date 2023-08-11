import React, { useState, useEffect, useMemo } from "react";

import { Drawer, type DrawerProps } from "./Drawer";

export type DrawerRenderer = () => Promise<JSX.Element | null>;

export interface UseDetailDrawerProps extends Omit<DrawerProps, "loading" | "onClose" | "children" | "open"> {
  readonly render?: DrawerRenderer;
  readonly disabled?: boolean;
}

export const useDrawer = ({
  render,
  disabled,
  ...props
}: UseDetailDrawerProps): {
  drawer: JSX.Element | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  loading: boolean;
} => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState(false);

  const renderContent = useMemo(
    () => async () => {
      if (render && disabled !== true) {
        setLoading(true);
        const content = await render();
        if (content) {
          setContent(content);
        } else {
          setContent(null);
        }
        setLoading(false);
      } else {
        setContent(null);
      }
    },
    [render, disabled],
  );

  useEffect(() => {
    if (open) {
      renderContent();
    } else {
      setContent(null);
    }
  }, [open, renderContent]);

  return {
    /* The loading state when there is already prepopulated content is handled by the suspense of the server
       component. */
    drawer: (
      <Drawer
        {...props}
        loading={loading && content === null}
        open={loading || content !== null}
        onClose={() => setOpen(false)}
      >
        {content}
      </Drawer>
    ),
    loading,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(v => !v),
  };
};

export default useDrawer;
