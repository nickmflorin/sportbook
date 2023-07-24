import Image, { type ImageProps } from "next/image";
import React from "react";

import classNames from "classnames";

import { icons, type ComponentProps, type BorderRadiusSize } from "~/lib/ui";
import { type InitialsString, parseInitials } from "~/lib/util/strings";
import { Icon } from "~/components/icons";
import { Text, type TextProps } from "~/components/typography";

export type ModelImageProps = ComponentProps &
  Omit<ImageProps, "src" | "alt" | "height" | "width"> & {
    readonly fallbackIcon?: icons.IconProp;
    readonly fallbackInitials?: InitialsString;
    readonly src?: ImageProps["src"] | null;
    readonly alt?: string;
    readonly borderRadius?: BorderRadiusSize;
    readonly size?: Exclude<ImageProps["height"] & ImageProps["width"], undefined>;
    readonly fontSize?: TextProps["size"];
  };

export const ModelImage = ({
  fallbackIcon = icons.IconNames.IMAGE,
  fallbackInitials,
  alt = "",
  src,
  size,
  borderRadius,
  className,
  style,
  fontSize,
  ...props
}: ModelImageProps) => (
  <div
    style={{ ...style, height: size, width: size }}
    className={classNames("model-image", borderRadius && `model-image--border-radius-${borderRadius}`, className)}
  >
    {src !== undefined && src !== null ? (
      <Image {...props} height={size} width={size} src={src} alt={alt} />
    ) : (
      <div className="model-image__fallback">
        {fallbackInitials ? (
          <Text size={fontSize}>{parseInitials(fallbackInitials)}</Text>
        ) : (
          <Icon icon={fallbackIcon} />
        )}
      </div>
    )}
  </div>
);
