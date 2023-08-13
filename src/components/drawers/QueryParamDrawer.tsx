"use client";
import { type DrawerProps } from "~/components/drawers/Drawer";
import { useDeepEqualEffect } from "~/hooks/useDeep";
import { useParsedQueryParams } from "~/hooks/useQueryParams";

import { useDrawerRenderer } from "./useDrawerRenderer";

export interface QueryParamDrawerProps<K extends string> {
  readonly params: K[];
  readonly children: (params: Record<K, string>) => Promise<JSX.Element | null>;
  readonly drawerProps?: Omit<DrawerProps, "loading" | "onClose" | "children" | "open">;
}

export const QueryParamDrawer = <K extends string>({ children, drawerProps, params }: QueryParamDrawerProps<K>) => {
  const { parsed, clearParams } = useParsedQueryParams({ params });

  const { renderContent, clearContent, drawer } = useDrawerRenderer({
    drawerProps,
    renderer: children,
    onClose: () => clearParams(params, { useTransition: false, push: true }),
  });

  /* The deep equal effect is necessary because the reference to the search params object changes when the route path
     changes, even if the actual query parameters are the same.  When switching between routes in a layout that shows a
     drawer, we do not want the drawer to reload if the drawer is rendered in the layout common to both paths. */
  useDeepEqualEffect(() => {
    if (parsed) {
      renderContent(parsed);
    } else {
      clearContent();
    }
  }, [parsed]);

  return drawer;
};

export default QueryParamDrawer;

export type QueryParamDrawerType = {
  <K extends string>(props: QueryParamDrawerProps<K>): JSX.Element;
};
