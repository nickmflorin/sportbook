import dynamic from "next/dynamic";
import React from "react";

import { type Optional } from "utility-types";

import { type BaseButtonProps, BaseButton } from "./base";
import { type ButtonContentProps } from "./base/ButtonLinkContent";
import { type ButtonType, type ButtonVariant } from "./types";

const ButtonLinkContent = dynamic(() => import("./base/ButtonLinkContent"));

export type ButtonProps<T extends ButtonType, V extends ButtonVariant> = Optional<BaseButtonProps<T, V>, "children"> &
  Omit<ButtonContentProps, "component" | "children"> & {
    readonly content?: JSX.Element;
    readonly children?: string | JSX.Element;
  };

export const Button = <T extends ButtonType, V extends ButtonVariant>({
  icon,
  iconLocation,
  loading,
  children,
  content,
  iconSize,
  action,
  ...props
}: ButtonProps<T, V>) => (
  <BaseButton {...props} loading={loading}>
    {content !== undefined ? (
      content
    ) : (
      <ButtonLinkContent
        component="button"
        iconSize={iconSize}
        loading={loading}
        iconLocation={iconLocation}
        icon={icon}
        action={action}
      >
        {children}
      </ButtonLinkContent>
    )}
  </BaseButton>
);
