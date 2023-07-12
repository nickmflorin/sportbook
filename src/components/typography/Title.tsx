import classNames from "classnames";

import { type ComponentProps, type Style, type Color, type FontWeight, getColorClassName } from "~/lib/ui";
import { ensuresDefinedValue } from "~/lib/util";

type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6;

type Factories = {
  [key in TitleOrder]: (props: {
    readonly children: string;
    readonly className?: string;
    readonly style?: Style;
  }) => JSX.Element;
};

const factories: Factories = {
  1: props => <h1 {...props} />,
  2: props => <h2 {...props} />,
  3: props => <h3 {...props} />,
  4: props => <h4 {...props} />,
  5: props => <h5 {...props} />,
  6: props => <h6 {...props} />,
};

export interface TitleProps extends ComponentProps {
  readonly children: string;
  readonly order?: TitleOrder;
  readonly color?: Color;
  // Let the weight default in SASS baed on the size.
  readonly fontWeight?: FontWeight;
}

export const Title = ({ order = 3, fontWeight, color = "heading", children, ...props }: TitleProps): JSX.Element =>
  ensuresDefinedValue(factories[order])({
    ...props,
    children,
    className: classNames("title", getColorClassName("color", { color }), fontWeight && `font-weight-${fontWeight}`),
  });
