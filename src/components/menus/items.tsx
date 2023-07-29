import React from "react";

import type * as types from "./types";

import { isIconProp } from "~/components/icons";
import { Icon } from "~/components/icons/Icon";
import { Avatar } from "~/components/images/Avatar";
import { Checkbox } from "~/components/input/Checkbox";
import { Label } from "~/components/typography";

type ValuedMenuItemProps<
  I extends types.ValuedMenuItem<V> | types.DatumValuedMenuItem<V, M>,
  V extends string | null,
  M extends Record<string, unknown>,
> = Omit<I, "value" | "datum" | "onClick"> & {
  readonly selected: boolean;
  readonly withCheckbox?: boolean;
  readonly onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const ValuedMenuItem = <
  I extends types.ValuedMenuItem<V> | types.DatumValuedMenuItem<V, M>,
  V extends string | null,
  M extends Record<string, unknown>,
>({
  label,
  icon,
  selected,
  withCheckbox,
  onClick,
}: ValuedMenuItemProps<I, V, M>) => (
  <div className="menu-item" onClick={onClick}>
    {withCheckbox && <Checkbox readOnly checked={selected} mr="md" size={14} />}
    {icon ? isIconProp(icon) ? <Icon icon={icon} /> : <Avatar {...icon} /> : null}
    <Label>{label}</Label>
  </div>
);

type ValuelessMenuItemProps = Omit<types.ValuelessMenuItem, "onClick"> & {
  readonly onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const ValuelessMenuItem = ({ label, icon, onClick }: ValuelessMenuItemProps) => (
  <div className="menu-item" onClick={onClick}>
    {icon ? isIconProp(icon) ? <Icon icon={icon} /> : <Avatar {...icon} /> : null}
    <Label>{label}</Label>
  </div>
);
