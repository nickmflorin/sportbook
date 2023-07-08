import classNames from "classnames";

type MergeComponentPropsParams = {
  readonly styleOverride?: Style;
  readonly style?: Style;
  readonly className?: ClassName;
};

export const mergeComponentProps = <C extends ComponentProps>(provided: C, params: MergeComponentPropsParams): C => ({
  ...provided,
  className: classNames(
    params.className,
    ...(Array.isArray(provided.className) ? provided.className : [provided.className]),
  ),
  style: { ...params.style, ...provided.style, ...params.styleOverride },
});
