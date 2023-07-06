import classNames from "classnames";

import { type Color, type ColorShade, getColorClassName } from "~/styles";

export interface TextProps {
  readonly color: Color;
  readonly children: string;
  readonly shade?: ColorShade;
}

export const Text = ({ color, children, shade }: TextProps): JSX.Element => {
  return <div className={classNames("text", getColorClassName({ form: "color", color, shade }))}>{children}</div>;
};
