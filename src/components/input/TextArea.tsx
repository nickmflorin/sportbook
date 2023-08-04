"use client";
import { Textarea as RootTextArea, type TextareaProps as RootTextAreaProps } from "@mantine/core";
import classNames from "classnames";

import { type InputSize } from "./types";

export type TextAreaProps = Omit<RootTextAreaProps, "size"> & {
  readonly size?: InputSize;
};

/* Eventually, this will be replaced with an internally created TextArea element.  For now, we will just use Mantine's
   and try to make it look close to what ours should look like - based on the characteristics of other elements. */
export const TextArea = ({ size, ...props }: TextAreaProps): JSX.Element => (
  <RootTextArea
    {...props}
    size="sm"
    className={classNames("text-area", size && `text-area--${size}`, props.className)}
  />
);
