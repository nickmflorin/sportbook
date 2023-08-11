import classNames from "classnames";
import { type Optional } from "utility-types";

import { type BadgeProps } from "~/components/badges/Badge";
import { AlternateButton, type AlternateButtonProps } from "~/components/buttons/AlternateButton";
import { Flex } from "~/components/structural/Flex";
import { Text } from "~/components/typography/Text";

import { ModelImage, type ModelImageProps } from "./ModelImage";

type Base = Optional<Omit<ModelImageProps, "borderRadius" | "fallbackIcon" | "image">, "size">;

export interface AvatarProps extends Base {
  readonly displayName?: string | null;
  readonly href?: AlternateButtonProps["href"];
  readonly onClick?: AlternateButtonProps["onClick"];
  readonly tags?: React.ReactElement<BadgeProps>[];
  readonly contentDirection?: "row" | "column";
}

export const Avatar = ({
  displayName,
  href,
  contentDirection = "column",
  tags = [],
  onClick,
  size = 30,
  ...props
}: AvatarProps): JSX.Element => {
  if (typeof displayName !== "string" && tags.length === 0) {
    return <ModelImage fontSize="sm" {...props} size={size} className={classNames("avatar", props.className)} />;
  }
  return (
    <Flex
      direction="row"
      className={classNames("avatar-with-name", props.className)}
      align={displayName && tags.length !== 0 && contentDirection === "column" ? "start" : "center"}
      style={tags.length !== 0 && displayName ? {} : { height: size }}
    >
      <Avatar {...props} size={size} />
      <Flex
        direction={contentDirection}
        className="avatar-with-name__content"
        align={contentDirection === "row" ? "center" : "start"}
      >
        {displayName ? (
          href !== undefined ? (
            <AlternateButton.Secondary href={href}>{displayName}</AlternateButton.Secondary>
          ) : onClick !== undefined ? (
            <AlternateButton.Secondary onClick={onClick}>{displayName}</AlternateButton.Secondary>
          ) : (
            <Text>{displayName}</Text>
          )
        ) : (
          <></>
        )}
        {tags.length !== 0 && <div className="avatar-with-name__tags">{tags}</div>}
      </Flex>
    </Flex>
  );
};
