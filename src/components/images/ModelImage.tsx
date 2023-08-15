import Image from "next/image";
import React from "react";

import classNames from "classnames";
import { type Optional } from "utility-types";

import { type ComponentProps, type BorderRadiusSize } from "~/lib/ui";
import { parseInitials } from "~/lib/util/strings";
import { type IconProp } from "~/components/icons";
import { Icon } from "~/components/icons/Icon";
import { type ImageProp } from "~/components/images";
import { Loading } from "~/components/loading/Loading";
import { Text, type TextProps } from "~/components/typography/Text";

type BaseModelImageProps = ComponentProps & {
  readonly fallbackIcon?: IconProp;
  readonly alt?: string;
  readonly borderRadius?: BorderRadiusSize;
  readonly fontSize?: TextProps["size"];
  readonly loading?: boolean;
};

type ModelImageSpreadProps = BaseModelImageProps &
  ImageProp & {
    readonly image?: never;
  };

type ModelImageExplicitProps = BaseModelImageProps &
  Pick<ImageProp, "size"> & { [key in Exclude<keyof ImageProp, "size">]?: never } & {
    readonly image: Omit<ImageProp, "size">;
  };

type ModelImageExplicitSizeOverwriteProps = BaseModelImageProps &
  Optional<Pick<ImageProp, "size">, "size"> & { [key in Exclude<keyof ImageProp, "size">]?: never } & {
    readonly image: ImageProp;
  };

export type ModelImageProps = ModelImageSpreadProps | ModelImageExplicitProps | ModelImageExplicitSizeOverwriteProps;

const getImageVar = <K extends keyof ImageProp>(k: K, props: Pick<ModelImageProps, "image" | K>): ImageProp[K] => {
  // Explicit props in top level spread take precedence/are used to override potential props nested under 'image'.
  if (props[k] === undefined) {
    /* It is safe to force coerce here because the only missing property would be size, in which case it will simply be
       undefined. */
    return props.image ? (props.image as ImageProp)[k] : (props[k] as ImageProp[K]);
  }
  return props[k] as ImageProp[K];
};

export const ModelImage = ({
  fallbackIcon = { name: "image" },
  initials,
  alt = "",
  url,
  size,
  borderRadius,
  className,
  style,
  fontSize,
  image,
  loading,
}: ModelImageProps) => {
  const _url = getImageVar("url", { image, url });
  const _size = getImageVar("size", { image, size });
  const _initials = getImageVar("initials", { image, initials });
  return (
    <div
      style={{ ...style, height: size, width: size }}
      className={classNames("model-image", borderRadius && `model-image--border-radius-${borderRadius}`, className)}
    >
      <Loading loading={loading === true} />
      {_url !== undefined && _url !== null ? (
        <Image height={_size} width={_size} src={_url} alt={alt} />
      ) : (
        <div className="model-image__fallback">
          {_initials ? <Text size={fontSize}>{parseInitials(_initials)}</Text> : <Icon icon={fallbackIcon} />}
        </div>
      )}
    </div>
  );
};
