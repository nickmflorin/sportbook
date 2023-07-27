import classNames from "classnames";
import { type Optional } from "utility-types";

import { Text } from "~/components/typography";

import { ModelImage, type ModelImageProps } from "./ModelImage";

type Base = Optional<Omit<ModelImageProps, "src" | "borderRadius" | "fallbackIcon" | "fallbackInitials">, "size">;

/* type ImagelessAvatarProps = Base & {
     readonly initials?: ModelImageProps["fallbackInitials"];
     readonly imageUrl?: never;
     readonly displayName?: string;
   } */

/*   = Optional<Omit<ModelImageProps, "src" | "borderRadius" | "fallbackIcon" | "fallbackInitials">, "size"> {
     readonly initials?: ModelImageProps["fallbackInitials"];
     readonly imageUrl?: string | null;
     readonly displayName?: string | null;
   } */

export interface AvatarProps extends Base {
  readonly initials?: ModelImageProps["fallbackInitials"];
  readonly imageUrl?: string | null;
  readonly displayName?: string | null;
}

export const Avatar = ({ displayName, size = 30, ...props }: AvatarProps): JSX.Element => {
  if (typeof displayName !== "string") {
    return (
      <ModelImage
        fontSize="sm"
        {...props}
        size={size}
        className={classNames("avatar", props.className)}
        src={props.imageUrl}
        fallbackInitials={props.initials}
      />
    );
  }
  return (
    <div className={classNames("avatar-with-name", props.className)} style={{ height: size }}>
      <Avatar {...props} size={size} />
      <Text>{displayName}</Text>
    </div>
  );
};
