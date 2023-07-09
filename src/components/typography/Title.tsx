import { type ComponentProps, pluckNativeComponentProps } from "~/lib/ui";
import { ensuresDefinedValue } from "~/lib/util";

type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6;

type Factories = {
  [key in TitleOrder]: (
    props: Omit<TitleProps, "order" | "className" | "color" | "fontSize" | "fontWeight">,
  ) => JSX.Element;
};

const factories: Factories = {
  1: props => <h1 {...props} />,
  2: props => <h2 {...props} />,
  3: props => <h3 {...props} />,
  4: props => <h4 {...props} />,
  5: props => <h5 {...props} />,
  6: props => <h6 {...props} />,
};

export interface TitleProps extends Pick<ComponentProps, "className" | "style" | "color" | "fontSize" | "fontWeight"> {
  readonly children: string;
  readonly order?: TitleOrder;
}

export const Title = ({ order = 3, ...props }: TitleProps): JSX.Element => {
  const [{ children }, nativeProps] = pluckNativeComponentProps({ className: "title" }, props);
  return ensuresDefinedValue(factories[order])({
    ...nativeProps,
    children,
  });
};
