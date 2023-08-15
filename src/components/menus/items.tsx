import React, { useState, useImperativeHandle, useRef } from "react";

import classNames from "classnames";

import type * as types from "./types";

import { isIconProp } from "~/components/icons";
import { Icon } from "~/components/icons/Icon";
import { isImageProp } from "~/components/images";
import { Avatar } from "~/components/images/Avatar";
import { Checkbox } from "~/components/input/Checkbox";
import { Label } from "~/components/typography/Label";

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
}: BaseMenuItemProps<I, V, M>): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [subContent, setSubContent] = useState<JSX.Element | undefined>(undefined);

  const menuItem = useRef<types.IMenuItem>(null);

  useImperativeHandle(menuItem, () => ({
    setLoading,
    toggleLoading: () => setLoading(prev => !prev),
    showSubContent: (content: JSX.Element) => setSubContent(content),
    hideSubContent: () => setSubContent(undefined),
  }));

  if (item.hidden === true || item.visible === false) {
    return <></>;
  }
  return (
    <div style={item.style} className={classNames("menu-item", { selected, disabled: item.disabled }, item.className)}>
      <div
        className="menu-item__content"
        onClick={e => {
          if (!item.disabled && menuItem.current) {
            onClick?.(e);
            item.onClick?.(menuItem.current, e);
          }
        }}
      >
        {/* TODO: We need to come up with a loading state for the Avatar case. */}
        {withCheckbox && <Checkbox readOnly checked={selected} mr="md" size={14} />}
        {item.icon ? (
          isIconProp(item.icon) ? (
            <Icon size="xs" icon={item.icon} loading={item.loading || loading} />
          ) : isImageProp(item.icon) ? (
            <Avatar {...item.icon} loading={item.loading || loading} />
          ) : (
            item.icon
          )
        ) : (
          <Icon size="xs" loading={item.loading || loading} />
        )}
        <Label>{item.label}</Label>
      </div>
      {subContent && <div className="menu-item__sub-content">{subContent}</div>}
    </div>
  );
};

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
