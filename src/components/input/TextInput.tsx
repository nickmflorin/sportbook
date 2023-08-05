"use client";
import { TextInput as RootTextInput, type TextInputProps as RootTextInputProps } from "@mantine/core";
import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";

import { type InputSize } from "./types";

export type TextInputProps = ComponentProps &
  Omit<RootTextInputProps, "size" | "className" | "style" | "sx" | "styles" | "form"> & {
    readonly size?: InputSize;
  };

/* Eventually, this will be replaced with an internally created TextInput element.  For now, we will just use Mantine's
   and try to make it look close to what ours should look like - based on the characteristics of other elements. */
export const TextInput = ({ size, ...props }: TextInputProps): JSX.Element => (
  <RootTextInput
    {...props}
    size="sm"
    className={classNames("text-input", size && `text-input--${size}`, props.className)}
  />
);
