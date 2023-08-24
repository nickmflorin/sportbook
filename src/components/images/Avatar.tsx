import classNames from "classnames";
import { type Optional } from "utility-types";

import { type BadgeProps } from "~/components/badges/Badge";
import { AlternateButton, type AlternateButtonProps } from "~/components/buttons/AlternateButton";
import { Flex } from "~/components/structural/Flex";
import { Text } from "~/components/typography/Text";

import { ModelImage, type ModelImageProps } from "./ModelImage";

type Base = Optional<Omit<ModelImageProps, "borderRadius" | "fallbackIcon" | "image">, "size">;

export interface AvatarProps extends Base {
  readonly name?: string | null;
  readonly button?: JSX.Element;
  readonly href?: AlternateButtonProps["href"];
  readonly onClick?: AlternateButtonProps["onClick"];
  readonly tags?: React.ReactElement<BadgeProps>[];
  readonly contentDirection?: "row" | "column";
}

export const Avatar = ({
  name,
  href,
  button,
  contentDirection = "column",
  tags = [],
  onClick,
  size = 30,
  ...props
}: AvatarProps): JSX.Element => {
  if (typeof name !== "string" && tags.length === 0 && button === undefined) {
    return <ModelImage fontSize="sm" {...props} size={size} className={classNames("avatar", props.className)} />;
  }
  return (
    <Flex
      direction="row"
      className={classNames("avatar-with-name", props.className)}
      align={name && tags.length !== 0 && contentDirection === "column" ? "start" : "center"}
      style={tags.length !== 0 && name ? {} : { height: size }}
    >
      <Avatar {...props} size={size} />
      <Flex
        direction={contentDirection}
        className="avatar-with-name__content"
        align={contentDirection === "row" ? "center" : "start"}
      >
        {button ? (
          button
        ) : name ? (
          href !== undefined ? (
            <AlternateButton.Secondary fontSize="md" href={href}>
              {name}
            </AlternateButton.Secondary>
          ) : onClick !== undefined ? (
            <AlternateButton.Secondary fontSize="md" onClick={onClick}>
              {name}
            </AlternateButton.Secondary>
          ) : (
            <Text>{name}</Text>
          )
        ) : (
          <></>
        )}
        {tags.length !== 0 && <div className="avatar-with-name__tags">{tags}</div>}
      </Flex>
    </Flex>
  );
};
