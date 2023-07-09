import { type ComponentProps, pluckNativeComponentProps } from "~/lib/ui";

export interface LabelProps extends Pick<ComponentProps, "className" | "style" | "color" | "fontSize" | "fontWeight"> {
  readonly children: string;
}

export const Label = (props: LabelProps): JSX.Element => {
  const [{ children }, nativeProps] = pluckNativeComponentProps({ className: "label" }, props);
  return <div {...nativeProps}>{children}</div>;
};
