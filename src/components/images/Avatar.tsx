import classNames from "classnames";
import { type Optional } from "utility-types";

import { AlternateButton, type AlternateButtonProps } from "~/components/buttons/AlternateButton";
import { Text } from "~/components/typography/Text";

import { ModelImage, type ModelImageProps } from "./ModelImage";

type Base = Optional<Omit<ModelImageProps, "borderRadius" | "fallbackIcon" | "image">, "size">;

export interface AvatarProps extends Base {
  readonly displayName?: string | null;
  readonly href?: AlternateButtonProps["href"];
}

export const Avatar = ({ displayName, href, size = 30, ...props }: AvatarProps): JSX.Element => {
  if (typeof displayName !== "string") {
    return <ModelImage fontSize="sm" {...props} size={size} className={classNames("avatar", props.className)} />;
  }
  return (
    <div className={classNames("avatar-with-name", props.className)} style={{ height: size }}>
      <Avatar {...props} size={size} />
      {href !== undefined ? (
        <AlternateButton.Secondary href={href}>{displayName}</AlternateButton.Secondary>
      ) : (
        <Text>{displayName}</Text>
      )}
    </div>
  );
};
