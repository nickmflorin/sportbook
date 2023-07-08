declare global {
  type ClassName = import("classNames").ArgumentArray | import("classNames").Argument;
  type Style = import("react").CSSProperties;

  type ComponentProps<C extends import("react").ReactNode | JSX.Element | JSX.Element[] | undefined = undefined> =
    C extends undefined
      ? {
          readonly style?: Style;
          readonly className?: string;
        }
      : {
          readonly children: C;
        } & ComponentProps;
}

export {};
