import classNames from "classnames";
import { type Optional } from "utility-types";

import { Text } from "~/components/typography/Text";

import { ModelImage, type ModelImageProps } from "./ModelImage";

type Base = Optional<Omit<ModelImageProps, "borderRadius" | "fallbackIcon" | "image">, "size">;

export interface AvatarProps extends Base {
  readonly displayName?: string | null;
}

export const Avatar = ({ displayName, size = 30, ...props }: AvatarProps): JSX.Element => {
  if (typeof displayName !== "string") {
    return <ModelImage fontSize="sm" {...props} size={size} className={classNames("avatar", props.className)} />;
  }
  return (
    <div className={classNames("avatar-with-name", props.className)} style={{ height: size }}>
      <Avatar {...props} size={size} />
      <Text>{displayName}</Text>
    </div>
  );
};
