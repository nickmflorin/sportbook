import { useState, useEffect } from "react";

import { useDrawerRenderer, type DrawerRendererProps } from "./useDrawerRenderer";

export type UseDetailDrawerProps = Omit<DrawerRendererProps<[]>, "onClose">;

export const useDrawer = ({
  renderer,
  drawerProps,
  disabled,
}: UseDetailDrawerProps): {
  drawer: JSX.Element | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
} => {
  const [open, setOpen] = useState(false);
  const { renderContent, clearContent, drawer } = useDrawerRenderer({
    renderer,
    disabled,
    drawerProps,
    onClose: () => setOpen(false),
  });

  useEffect(() => {
    if (open) {
      renderContent();
    } else {
      clearContent();
    }
  }, [open, renderContent, clearContent]);

  return {
    // The loading state when there is already prepopulated content is handled by the suspense of the server component.
    drawer,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(v => !v),
  };
};

export default useDrawer;
