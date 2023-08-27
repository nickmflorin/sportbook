"use client";
import dynamic from "next/dynamic";
import React from "react";

import classNames from "classnames";

import { type CSSDirection, CSSDirections } from "~/lib/ui";
import { type IconProp, type IconSize, IconSizes, type DynamicIconProp } from "~/components/icons";

const Icon = dynamic(() => import("~/components/icons/Icon"));

import { type ButtonAction } from "../types";

type Loc = Exclude<CSSDirection, typeof CSSDirections.UP | typeof CSSDirections.DOWN>;

export type ButtonContentProps = {
  readonly component: "button";
  readonly children?: string | JSX.Element;
  readonly loading?: boolean;
  readonly action?: ButtonAction;
  readonly icon?: IconProp | DynamicIconProp;
  readonly iconLocation?: Loc;
  readonly iconSize?: IconSize;
};

export type LinkContentProps = {
  readonly component: "link";
  readonly loading?: never;
  readonly children?: string | JSX.Element;
  readonly icon?: IconProp | DynamicIconProp;
  readonly iconLocation?: Loc;
  readonly iconSize?: IconSize;
  readonly action?: never;
};

export type ButtonLinkContentProps = ButtonContentProps | LinkContentProps;

export const ButtonLinkContent = ({
  iconLocation = CSSDirections.LEFT,
  loading,
  component,
  iconSize = IconSizes.FILL,
  icon,
  children,
  action,
}: ButtonLinkContentProps): JSX.Element => (
  <div className={`${component}__content`}>
    {iconLocation === CSSDirections.LEFT && (icon !== undefined || loading === true) && (
      <div className={`${component}__icon-wrapper`}>
        <Icon size={iconSize} icon={icon} loading={loading} axis="vertical" />
      </div>
    )}
    <div className={`${component}__sub-content`}>{children}</div>
    {action && (
      <div className={classNames(`${component}__icon-wrapper`, `${component}__action-icon-wrapper`)}>
        <Icon
          size={action.iconSize || iconSize}
          icon={action.icon}
          loading={action.loading}
          hidden={action.hidden}
          visible={action.visible}
          axis="vertical"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            action.onClick(e);
          }}
        />
      </div>
    )}
    {iconLocation === CSSDirections.RIGHT && (icon !== undefined || loading === true) && (
      <div className={`${component}__icon-wrapper`}>
        <Icon size={iconSize} icon={icon} loading={loading} axis="vertical" />
      </div>
    )}
  </div>
);

export default ButtonLinkContent;
