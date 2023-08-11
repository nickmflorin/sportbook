import React, { useState, useEffect, useMemo } from "react";

import { Drawer, type DrawerProps } from "./Drawer";

export type DetailDrawerRenderer = (props: { id: string }) => Promise<JSX.Element | null>;

export interface UseDetailDrawerProps extends Omit<DrawerProps, "loading" | "onClose" | "children" | "open"> {
  readonly render?: DetailDrawerRenderer;
}

export const useDetailDrawer = ({
  render,
  ...props
}: UseDetailDrawerProps): {
  drawer: JSX.Element | null;
  setId: (id: string) => void;
  id: string | null;
  loading: boolean;
} => {
  const [id, setId] = useState<string | null>(null);
  const [content, setContent] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState(false);

  const renderContent = useMemo(
    () => async (id: string) => {
      if (render) {
        setLoading(true);
        const content = await render({ id });
        if (content) {
          setContent(content);
        } else {
          setContent(null);
        }
        setLoading(false);
      }
    },
    [render],
  );

  useEffect(() => {
    if (id) {
      renderContent(id);
    } else {
      setContent(null);
    }
  }, [id, renderContent]);

  return {
    /* The loading state when there is already prepopulated content is handled by the suspense of the server
       component. */
    drawer: (
      <Drawer
        {...props}
        loading={loading && content === null}
        open={loading || content !== null}
        onClose={() => setId(null)}
      >
        {content}
      </Drawer>
    ),
    loading,
    setId,
    id,
  };
};

export default useDetailDrawer;
