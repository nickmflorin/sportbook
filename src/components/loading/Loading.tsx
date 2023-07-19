import React, { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps, type icons } from "~/lib/ui";
import { Spinner, type SpinnerProps } from "~/components/icons";
import { ShowHide } from "~/components/util";

type BaseLoadingProps = ComponentProps &
  Pick<SpinnerProps, "color" | "size" | "loading"> & {
    readonly size?: Exclude<SpinnerProps["size"], typeof icons.IconSizes.FILL>;
  };

type LoadingChildProps = BaseLoadingProps & {
  readonly children?: ReactNode;
  readonly hideWhenLoading?: boolean;
  readonly overlay?: never;
};

type LoadingOverlayProps = BaseLoadingProps & {
  readonly overlay: true;
  readonly hideWhenLoading?: never;
  readonly children?: never;
};

export type LoadingProps = LoadingChildProps | LoadingOverlayProps;

const _WrappedSpinner = ({
  size,
  color,
  overlay,
  ...props
}: Omit<LoadingProps, "loading" | "children" | "hideWhenLoading">) => (
  <div {...props} className={classNames("loading", { "loading--overlay": overlay }, props.className)}>
    <Spinner size={size} color={color} loading={true} />
  </div>
);

const WrappedSpinner = React.memo(_WrappedSpinner);

export const _Loading = ({
  loading,
  color = "blue.5",
  hideWhenLoading = false,
  children,
  ...props
}: LoadingProps): JSX.Element => {
  if (children) {
    if (hideWhenLoading === true) {
      return loading === true ? <WrappedSpinner color={color} {...props} /> : <>{children}</>;
    }
    return (
      <>
        <ShowHide show={loading === true}>
          <WrappedSpinner color={color} {...props} />
        </ShowHide>
        {children}
      </>
    );
  }
  return loading === true ? <WrappedSpinner color={color} {...props} /> : <></>;
};

/* Memoize this so that it doesn't rerender when the parent rerenders unless it needs to.  It can sometimes cause weird
   glitching or skipping behavior in spinner. */
export const Loading = React.memo(_Loading);
