import React from "react";

import classNames from "classnames";

import { SizeContains } from "~/lib/ui";

import { IconComponent } from "./IconComponent";
import { type SpinnerProps } from "./types";

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
