import React, { useMemo } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { type ButtonVariant } from "~/components/buttons";
import { ActionButton, type ActionButtonProps } from "~/components/buttons/ActionButton";
import { type IconProp, isIconProp } from "~/components/icons";
import { Icon } from "~/components/icons/Icon";

export type RenderAction = {
  readonly render: () => JSX.Element;
  readonly visible?: boolean;
};

export type IconAction<V extends ButtonVariant = ButtonVariant> = V extends ButtonVariant
  ? Pick<ActionButtonProps<V>, (keyof ActionButtonProps<V> & "color") | "icon" | "onClick"> & {
      readonly visible?: boolean;
      readonly disabled?: boolean;
      readonly variant: V;
    }
  : never;

export type Action = JSX.Element | IconAction | RenderAction | IconProp | undefined | null;

const isRenderAction = (action: Exclude<Action, undefined | null>): action is RenderAction =>
  !isIcon(action) && (action as RenderAction).render !== undefined;

const isIconAction = (action: Exclude<Action, undefined | null>): action is IconAction =>
  !isIcon(action) && (action as IconAction).icon !== undefined;

const isIcon = (action: Exclude<Action, undefined | null>): action is IconProp => isIconProp(action);

export const actionIsVisible = (a: Action) =>
  a !== null && a !== undefined && ((!isRenderAction(a) && !isIconAction(a)) || a.visible !== false);

export const filterVisibleActions = (actions: Action[]): Exclude<Action, null | undefined>[] =>
  actions.filter((a): a is Exclude<Action, null | undefined> => actionIsVisible(a));

export interface ActionsProps extends ComponentProps {
  /**
   * The actions that should be rendered inside of the component.  Each action can either be of type {@link JSX.Element}
   * type {@link RenderAction} or type {@link IconAction}.
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
      filterVisibleActions(actions || (Array.isArray(children) ? children : [children])).map((a, i) => {
        if (isRenderAction(a)) {
          return <React.Fragment key={i}>{a.render()}</React.Fragment>;
        } else if (isIconAction(a)) {
          return <ActionButton key={i} {...a} />;
        } else if (isIcon(a)) {
          return <Icon key={i} icon={a} />;
        }
        return a;
      }),
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
