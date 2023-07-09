import { type ComponentProps, pluckNativeComponentProps } from "~/lib/ui";

export interface TextProps extends Pick<ComponentProps, "className" | "style" | "color" | "fontSize" | "fontWeight"> {
  readonly children: string;
}

export const Text = (props: TextProps): JSX.Element => {
  const [{ children }, nativeProps] = pluckNativeComponentProps({ className: "body" }, props);
  return <div {...nativeProps}>{children}</div>;
};
