import React from "react";

import classNames from "classnames";

import { SizeContains } from "~/lib/ui";

import { IconComponent, type IconComponentProps } from "./IconComponent";
import { type IconDefinitionParams } from "./types";

export type SpinnerProps = Omit<
  IconComponentProps,
  | keyof IconDefinitionParams
  | "spin"
  | "icon"
  | "contain"
  | "loading"
  | "spinnerColor"
  | "hoveredColor"
  | "focusedColor"
> & {
  readonly loading: boolean;
};

export const Spinner = ({ color = "blue.6", loading, ...props }: SpinnerProps): JSX.Element =>
  loading === true ? (
    <IconComponent
      {...props}
      color={color}
      className={classNames("spinner", props.className)}
      spin={true}
      name="circle-notch"
      contain={SizeContains.SQUARE}
    />
  ) : (
    <></>
  );

export default Spinner;
