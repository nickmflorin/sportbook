"use client";
import React, { useMemo } from "react";

import { Flex, type FlexProps, type MantineTheme, useMantineTheme, packSx } from "@mantine/core";

import { ActionIcon, type ActionIconProps } from "~/components/buttons/ActionIcon";

export type RenderAction = {
  readonly render: () => JSX.Element;
  readonly visible?: boolean;
};

export type IconAction = Pick<ActionIconProps, "color" | "icon" | "stroke" | "onClick"> & {
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

export interface ActionsProps extends Omit<FlexProps, "align" | "direction" | "h"> {
  /**
   * The actions that should be rendered inside of the component.  Each action can either be of type {@link JSX.Element}
   * or an object of type {@link RenderAction} that includes a 'render' function and optional metadata.
   */
  readonly actions?: Action[];
  readonly children?: JSX.Element | JSX.Element[];
  /**
   * Defines the spacing between actions in the component.
   */
  readonly spacing?: string | number | ((t: MantineTheme) => string | number);
  /**
   * Defines the height of the set of action components as a whole and individually.
   */
  readonly h?: string | number | ((t: MantineTheme) => string | number);
}

/**
 * A component that is responsible for rendering a list of actions or supplementary elements in a row, usually next to
 * other elements inside of the parent component.  The component will properly size and space each action relative to
 * one another and ensure that the actions are aligned with sibling elements they accompany.
 *
 * @example
 * // Rendering several buttons next to a "Customers" title component.  The Title and Actions will all be aligned at
 * // 24px.
 * <Flex direction="row" align="center" justify="space-between">
 *   <Title order={6} sx={t => ({ fontWeight: t.other.fontWeights.medium, lineHeight: "24px" })}>
 *     Customers
 *   </Title>
 *   <Actions h={24} actions={[
 *     <Button key="0" onClick={() => addCustomer()}>Add</Button>,
 *     { visible: false, render: () => <Button key="1" onClick={() => deleteCustomer()}>Delete</Button> }
 *   ]} />
 * </Flex>
 */
export const Actions = ({ children = [], actions, spacing, h = "24px", ...props }: ActionsProps): JSX.Element => {
  const theme = useMantineTheme();

  const visibleActions = useMemo<JSX.Element[]>(
    () =>
      filterVisibleActions(actions || (Array.isArray(children) ? children : [children])).map(a =>
        isRenderAction(a) ? a.render() : isIconAction(a) ? <ActionIcon {...a} /> : a,
      ),
    [actions, children],
  );

  if (visibleActions.length !== 0) {
    return (
      <Flex
        justify="right"
        {...props}
        direction="row"
        align="center"
        gap={spacing ? (typeof spacing === "function" ? spacing(theme) : spacing) : theme.spacing.md}
        sx={[
          t => ({
            height: typeof h === "function" ? h(t) : h,
            "> *": {
              maxHeight: "100%",
              minHeight: "auto",
              minWidth: "0",
            },
          }),
          ...packSx(props.sx),
        ]}
      >
        {visibleActions.map((a: JSX.Element, i: number) => (
          <React.Fragment key={i}>{a}</React.Fragment>
        ))}
      </Flex>
    );
  }
  return <></>;
};
