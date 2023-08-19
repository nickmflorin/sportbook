"use client";
import { type ReactNode, useState, useRef, useEffect, useTransition } from "react";

import isEqual from "lodash.isequal";
import { createPortal } from "react-dom";

import { logger } from "~/application/logger";
import { ensuresDefinedValue } from "~/lib/util";
import { CloseButton } from "~/components/buttons/CloseButton";
import { Loading } from "~/components/loading/Loading";
import { useDeepEqualEffect } from "~/hooks/useDeep";
import { useParsedQueryParams } from "~/hooks/useQueryParams";

import { DrawerView, type DrawerViewProps } from "./DrawerView";

const MAX_DRAWERS = 2;

/* Returns the query parameters associated with a drawer that is currently in the DOM.  These query parameters are set
   as data attributes on the drawer element such that they can be used to manipulate the URL when the drawer needs to be
   closed in favor of more recently opened drawers. */
const getElementDrawerQueryParams = (c: Element): string[] => {
  const attrs = c.getAttributeNames();
  let drawerAttrs: string[] = [];
  for (const attr of attrs) {
    if (attr.startsWith("data-attr-drawer-")) {
      const split = attr.split("data-attr-drawer-");
      if (split && split.length > 1) {
        drawerAttrs = [...drawerAttrs, ensuresDefinedValue(split[1])];
      } else {
        logger.error(`Corrupted drawer data-attr tag: '${attr}'!`);
      }
    }
  }
  return drawerAttrs;
};

const getElementDrawerDataAttributes = <K extends string>(params: Record<K, string> | null): Record<string, string> => {
  const dataAttrs: Record<string, string> = {};
  // throw error if params are defined but empty
  if (params && Object.keys(params).length !== 0) {
    for (const k in params) {
      const key = `data-attr-drawer-${k.toLowerCase()}`;
      dataAttrs[key] = ensuresDefinedValue(params[k]);
    }
  }
  return dataAttrs;
};

const getQueryTarget = (instanceId?: string): Element | null => {
  const tg = document.querySelector("#drawer-target");
  if (tg) {
    return tg;
  }
  if (instanceId) {
    // This would only ever happen if the <div id="#drawer-target"> was removed from the DOM.
    logger.error(
      { instanceId },
      "The drawer target with ID '#drawer-target' could not be found in the DOM when rendering a query parameter " +
        `controlled drawer with instance ID ${instanceId}!`,
    );
  } else {
    // This would only ever happen if the <div id="#drawer-target"> was removed from the DOM.
    logger.error(
      { instanceId },
      "The drawer target with ID '#drawer-target' could not be found in the DOM when rendering a client controlled " +
        "drawer!",
    );
  }
  return null;
};
const getDrawerParamsToClose = (children: Element[]): string[] => {
  let params: string[] = [];
  /* If there are already the maximum number of drawers open, and none are associated with the current instance ID,
     the last opened drawer needs to be closed in favor of the drawer with the provided instance ID. */
  if (children.length > MAX_DRAWERS - 1) {
    /* Even though there should only ever be at most 2 children, we'll cover edge cases by removing all after the
       first. */
    for (const c of children.slice(MAX_DRAWERS - 1)) {
      const newParams = getElementDrawerQueryParams(c);
      params = [...params, ...newParams];
    }
  }
  return params;
};

const getClientTarget = (): [Element, string[]] | null => {
  const tg = document.querySelector("#client-drawer-target");
  if (!tg) {
    // This would only ever happen if the <div id="#drawer-target"> was removed from the DOM.
    logger.error(
      "The drawer target with ID '#drawer-client-target' could not be found in the DOM when rendering a client " +
        "controlled drawer!",
    );
    return null;
  }
  /* Even though the drawer in context is being controlled client-side (i.e. not by query params), we still want to
     close existing query parameter drawers if the total number of drawers - including the client side drawer - exceeds
     the maximum allowed.  This will prevent too many drawers from being opened at the same time when opening a drawer
     whose open/close behavior is controlled in state, not by query parameters.

     Note that this does not work the other way around.  When opening a query parameter drawer, since the drawer that is
     controlled via state controls the open/close behavior external to this component, it cannot be closed - and opening
     a query parameter drawer can lead to more than the maximum number of drawers being open at the same time if there
     are already client-controlled drawers open in the view. */
  const queryTarget = getQueryTarget();
  if (queryTarget) {
    const children = queryTarget.querySelectorAll(".drawer-wrapper");
    /* Return the query parameters that are associated with open query parameter drawers such that the URL can be
       manipulated to close the drawer if opening the client-controlled drawer causes the number of open drawers to
       exceed the max. */
    const params = getDrawerParamsToClose([...children]);
    return [tg, params];
  }
  return [tg, []];
};

const getInstanceTarget = (instanceId: string): [Element, string[]] | null => {
  const tg = getQueryTarget(instanceId);
  if (tg) {
    const children = tg.querySelectorAll(".drawer-wrapper");
    /* Look for children of the drawer target (which would be the drawers themselves) that are not associated with the
       current instance ID in context.  There should only ever be at most 2 of these children, but to cover edge cases
       we will also consider if there are more than 2 drawers in context.  If there are 2 or more drawers in context,
       and neither is associated with the current instance ID, we will have to replace the last opened drawer (which
       would be the second drawer) with the new drawer in context - associated with the provided 'instanceId'. */
    let nonInstanceChildren: Element[] = [];
    for (const [_, c] of children.entries()) {
      if (c.id !== instanceId) {
        nonInstanceChildren = [...nonInstanceChildren, c];
      }
    }
    const params = getDrawerParamsToClose(nonInstanceChildren);
    return [tg, params];
  }
  return null;
};

interface ClientDrawerPortalProps {
  readonly children: ReactNode;
  readonly open: boolean;
  readonly instanceId?: never;
  readonly onClear: (params: string[]) => void;
}

interface QueryParamDrawerPortalProps {
  readonly children: ReactNode;
  readonly instanceId: string;
  readonly open: boolean;
  readonly onClear: (params: string[]) => void;
}

type DrawerPortalProps = ClientDrawerPortalProps | QueryParamDrawerPortalProps;

export const DrawerPortal = ({ children, open, instanceId, onClear }: DrawerPortalProps): JSX.Element => {
  const [element, setElement] = useState<JSX.Element | null>(null);
  const [_, startTransition] = useTransition();

  // This must be in an effect to force the portal to render client side, because the document must be defined.
  useEffect(() => {
    if (open) {
      if (instanceId) {
        const target = getInstanceTarget(instanceId);
        if (target) {
          if (target[1].length !== 0) {
            onClear(target[1]);
          }
          startTransition(() => {
            setElement(createPortal(children, target[0]));
          });
          return;
        }
        return setElement(<></>);
      } else {
        const target = getClientTarget();
        if (target) {
          if (target[1].length !== 0) {
            onClear(target[1]);
          }
          startTransition(() => {
            setElement(createPortal(children, target[0]));
          });
          return;
        }
        return setElement(<></>);
      }
    }
    return setElement(<></>);
  }, [open, children, onClear, instanceId]);

  return <>{element}</>;
};

interface BaseDrawerProps {
  readonly insideView?: false;
}

export interface ClientDrawerProps extends BaseDrawerProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly children: ReactNode;
  readonly initial?: never;
  readonly params?: never;
  readonly instanceId?: never;
  readonly viewProps?: Omit<DrawerViewProps, "onClose" | "children" | "loading">;
  readonly onClose?: () => void;
}

export interface QueryParamDrawerProps<K extends string> extends BaseDrawerProps {
  readonly open?: never;
  readonly onClose?: never;
  readonly loading?: never;
  readonly params: K[];
  /**
   * The initial drawer content that should be included in the initial, server-side pre-render of this client component,
   * such that the dependency on the query parameters (which are only available in the client) do not force Next to
   * wait until client-side rendering to render the initial drawer when a user visits a URL with the appropriate,
   * drawer-related query parameters.
   *
   * This is helpful in cases where the drawer is being used in a layout component that does not have access to the
   * client-side query parameters but can use the 'next-url' header to determine what the initial content of the drawer
   * should be, allowing it to be pre-rendered server side without waiting for client-side rendering to occur.
   */
  readonly initial?: { content: JSX.Element | null; params: Record<K, string> };
  readonly instanceId: string;
  readonly viewProps?: Omit<DrawerViewProps, "onClose" | "children" | "loading">;
  readonly children: (params: Record<K, string>) => Promise<JSX.Element | null>;
}

export type DrawerProps<K extends string> = QueryParamDrawerProps<K> | ClientDrawerProps;

const propsAreQueryParamProps = <K extends string>(props: DrawerProps<K>): props is QueryParamDrawerProps<K> =>
  (props as QueryParamDrawerProps<K>).params !== undefined;

export const Drawer = <K extends string>(props: DrawerProps<K>): JSX.Element => {
  const { insideView, viewProps } = props;
  /* Used to both (a) Prevent client side rendering on the initial render when the initial content is provided via the
     server and (b) Prevent React from running the render multiple times in development mode (React will run effects
     2 times when in development mode - on the initial render, but only 1 time in production mode). */
  const lastRenderedParams = useRef<Record<K, string> | null>(
    propsAreQueryParamProps(props) ? props.initial?.params || null : null,
  );

  const { parsed, clearParams } = useParsedQueryParams({ params: propsAreQueryParamProps(props) ? props.params : [] });

  const [renderedContent, setRenderedContent] = useState<JSX.Element | null>(
    propsAreQueryParamProps(props) ? props.initial?.content || null : null,
  );
  const [rendering, setRendering] = useState(false); // Is this right?  Should we initialize based on initial?

  // rendering && renderedContent === null && parsed !== null
  const loading =
    (!propsAreQueryParamProps(props) && props.loading === true) || (propsAreQueryParamProps(props) && rendering);

  /* The deep equal effect is necessary because the reference to the search params object changes when the route path
     changes, even if the actual query parameters are the same.  When switching between routes in a layout that shows a
     drawer, we do not want the drawer to reload if the drawer is rendered in the layout common to both paths. */
  useDeepEqualEffect(() => {
    /* It is okay that the props are used to determine the type of drawer this is are not dependencies to the effect -
       they should not change and the effect should not fire even if they did change. */
    if (propsAreQueryParamProps(props)) {
      const render = async (params: Record<K, string>) => {
        setRendering(true);
        const content = await props.children(params);
        if (content) {
          setRenderedContent(content);
        } else {
          setRenderedContent(null);
        }
        setRendering(false);
      };
      /* The initial drawer content is provided when the component is being pre-rendered on the server.  If this is the
         case, do not re-render the content a second time once client-side rendering occurs and this effect fires.  To
         prevent this from happening, the 'lastRenderedParams' reference in conjunction with the initial parameters prop
         is used to block the first content render when this effect fires for the first time. */
      if (!isEqual(lastRenderedParams.current, parsed)) {
        if (parsed) {
          render(parsed);
          lastRenderedParams.current = parsed;
        } else {
          setRenderedContent(null);
          lastRenderedParams.current = null;
        }
      }
    }
  }, [parsed]);

  const onClose = !propsAreQueryParamProps(props)
    ? props.onClose
    : () => {
        clearParams(props.params, { useTransition: false, push: true });
      };

  const children = !propsAreQueryParamProps(props) ? props.children : renderedContent;

  // Note: We might not need to check if parsed is not null here...
  const open = !propsAreQueryParamProps(props)
    ? props.open
    : (rendering || renderedContent !== null) && parsed !== null;

  return (
    <DrawerPortal
      open={open}
      instanceId={props.instanceId}
      onClear={(p: string[]) => {
        clearParams(p, { useTransition: false, push: true });
      }}
    >
      <div
        className="drawer-wrapper"
        id={propsAreQueryParamProps(props) ? props.instanceId : "client-drawer"}
        {...(propsAreQueryParamProps(props) ? getElementDrawerDataAttributes(parsed) : {})}
      >
        {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
        <Loading loading={loading === true} />
        {insideView !== false ? <DrawerView {...viewProps}>{children}</DrawerView> : <>{children}</>}
      </div>
    </DrawerPortal>
  );
};

export type QueryParamDrawerType = {
  <K extends string>(props: QueryParamDrawerProps<K>): JSX.Element;
};

export default Drawer;
