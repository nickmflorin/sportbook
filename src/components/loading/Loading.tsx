import React, { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps, type icons } from "~/lib/ui";
import { Spinner, type SpinnerProps } from "~/components/display/icons";
import { ShowHide } from "~/components/util";

export type LoadingProps = Pick<ComponentProps, "className" | "style"> &
  Pick<SpinnerProps, "color" | "size" | "loading"> & {
    readonly size?: Exclude<SpinnerProps["size"], typeof icons.IconSizes.FILL>;
    readonly children?: ReactNode;
    readonly hideWhenLoading?: boolean;
  };

const _WrappedSpinner = ({ size, color, ...props }: Omit<LoadingProps, "loading" | "children" | "hideWhenLoading">) => (
  <div {...props} className={classNames("loading", props.className)}>
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
}: LoadingProps): JSX.Element =>
  hideWhenLoading === true ? (
    loading === true ? (
      <WrappedSpinner color={color} {...props} />
    ) : (
      <>{children}</>
    )
  ) : (
    <>
      <ShowHide show={loading === true}>
        <WrappedSpinner color={color} {...props} />
      </ShowHide>
      {children}
    </>
  );

/* Memoize this so that it doesn't rerender when the parent rerenders unless it needs to.  It can sometimes cause weird
   glitching or skipping behavior in spinner. */
export const Loading = React.memo(_Loading);
