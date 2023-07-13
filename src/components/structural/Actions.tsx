import React, { useMemo } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { BareActionButton, type BareActionButtonProps } from "~/components/buttons";

export type RenderAction = {
  readonly render: () => JSX.Element;
  readonly visible?: boolean;
};

export type IconAction = Pick<BareActionButtonProps, "color" | "icon" | "onClick"> & {
  readonly visible?: boolean;
  readonly disabled?: boolean;
};

export type Action = JSX.Element | IconAction | RenderAction | undefined | null;

const isRenderAction = (action: Exclude<Action, undefined | null>): action is RenderAction =>
  (action as RenderAction).render !== undefined;

const isIconAction = (action: Exclude<Action, undefined | null>): action is IconAction =>
  (action as IconAction).icon !== undefined;

export const actionIsVisible = (a: Action) =>
  a !== null && a !== undefined && ((!isRenderAction(a) && !isIconAction(a)) || a.visible !== false);

export const filterVisibleActions = (actions: Action[]) =>
  actions.filter((a): a is Exclude<Action, null | undefined> => actionIsVisible(a));

export interface ActionsProps extends ComponentProps {
  /**
   * The actions that should be rendered inside of the component.  Each action can either be of type {@link JSX.Element}
   * or an object of type {@link RenderAction} that includes a 'render' function and optional metadata.
   */
  readonly actions?: Action[];
  readonly children?: JSX.Element | JSX.Element[];
}

/**
 * A component that is responsible for rendering a list of actions or supplementary elements in a row, usually next to
 * other elements inside of the parent component.  The component will properly size and space each action relative to
 * one another and ensure that the actions are aligned with sibling elements they accompany.
 */
export const Actions = ({ children = [], actions, ...props }: ActionsProps): JSX.Element => {
  const visibleActions = useMemo<JSX.Element[]>(
    () =>
      filterVisibleActions(actions || (Array.isArray(children) ? children : [children])).map(a =>
        isRenderAction(a) ? a.render() : isIconAction(a) ? <BareActionButton {...a} /> : a,
      ),
    [actions, children],
  );

  if (visibleActions.length !== 0) {
    return (
      <div {...props} className={classNames("actions", props.className)}>
        {visibleActions.map((a: JSX.Element, i: number) => (
          <React.Fragment key={i}>{a}</React.Fragment>
        ))}
      </div>
    );
  }
  return <></>;
};
