import React from "react";

import classNames from "classnames";

import type * as types from "./types";

import { isIconProp } from "~/components/icons";
import { Icon } from "~/components/icons/Icon";
import { Avatar } from "~/components/images/Avatar";
import { Checkbox } from "~/components/input/Checkbox";
import { Label } from "~/components/typography";

type BaseMenuItemProps<I extends types.MenuItem<V, M>, V extends string | null, M extends Record<string, unknown>> = {
  readonly item: Omit<I, "value">;
  readonly selected?: boolean;
  readonly withCheckbox?: boolean;
  readonly onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const BaseMenuItem = <
  I extends types.MenuItem<V, M>,
  V extends string | null,
  M extends Record<string, unknown>,
>({
  item,
  selected,
  withCheckbox,
  onClick,
}: BaseMenuItemProps<I, V, M>): JSX.Element =>
  item.hidden === true ? (
    <></>
  ) : (
    <div
      style={item.style}
      className={classNames("menu-item", { selected, disabled: item.disabled }, item.className)}
      onClick={e => {
        if (!item.disabled) {
          onClick?.(e);
          item.onClick?.(e);
        }
      }}
    >
      {/* TODO: We need to come up with a loading state for the Avatar case. */}
      {withCheckbox && <Checkbox readOnly checked={selected} mr="md" size={14} />}
      {item.icon ? (
        isIconProp(item.icon) ? (
          <Icon icon={item.icon} loading={item.loading} />
        ) : (
          <Avatar {...item.icon} />
        )
      ) : null}
      <Label>{item.label}</Label>
    </div>
  );

export const ValuedMenuItemRenderer = <
  I extends types.ValuedMenuItem<V> | types.DatumValuedMenuItem<V, M>,
  V extends string | null,
  M extends Record<string, unknown>,
>(
  props: BaseMenuItemProps<I, V, M>,
) => <BaseMenuItem {...props} />;

type ValuelessMenuItemProps = Omit<
  BaseMenuItemProps<types.ValuelessMenuItem, never, never>,
  "selected" | "withCheckbox" | "onClick"
>;

export const ValuelessMenuItemRenderer = (props: ValuelessMenuItemProps) => <BaseMenuItem {...props} />;
